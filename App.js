import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Home } from './src/components/home/Home';
import { Saved } from './src/components/saved/Saved';
import { FIconButton } from './src/res/custom/FButtons';
import { More } from './src/components/more/More';
import { colors } from './src/res/colors';
import { Lyrics } from './src/components/home/Lyrics';
import { FLogin } from './src/res/custom/AccessControl/FLogin';
import { FNewAccount } from './src/res/custom/AccessControl/FNewAccount';
import { FConfirmAccount } from './src/res/custom/AccessControl/FConfirmAccount';
import { FSearch } from './src/res/custom/FSearch';
import { FAbout } from './src/res/custom/FAbout';
import { FProfile } from './src/res/custom/profile/FProfile';
import { FChangePhoto } from './src/res/custom/profile/FChangePhoto';
import { AllComments } from './src/components/home/AllComments';
import { EditLyrics } from './src/components/home/EditLyrics';
import { CommentOnLyrics } from './src/components/home/CommentOnLyrics';


const topNavigator = createMaterialTopTabNavigator(
  {
      Home: Home,
      Saved: Saved,
      More: More
  },
  {
      initialRouteName: 'Home',
      tabBarOptions: {
          activeTintColor: colors.purple,
          inactiveTintColor: colors.black,
          labelStyle: {
              fontSize: 12,
              padding: 5,
          },
          indicatorStyle: {
              backgroundColor: colors.purple,
          },
          style: {
              backgroundColor: colors.white,
              color: colors.black,
          }
      }
  }
);

// const TopTab = createAppContainer(topNavigator);


// Main ( App ) when the user has or is-already logged in
const mainNavigator = createStackNavigator(
  {
      Tab: {
          screen: topNavigator,
          navigationOptions: ({ navigation }) => ({
              headerTitle: 'ULyrics',
              headerRight: (
                  <FIconButton
                      source={ require('./src/res/icons/search.png') }
                      onPress={ () => navigation.navigate('Search') }
                      iconStyles={{ marginRight: 30, tintColor: colors.purple }}
                  />
              ),
              ...navConfig
          })
      },
      Lyrics: {
        screen: Lyrics,
        navigationOptions: () => ({
          ...inNavConfig
        })
      },
      EditLyrics: {
        screen: EditLyrics,
        navigationOptions: () => ({
          headerTitle: 'Edit Lyrics',
          ...inNavConfig
        })
      },
      CommentOnLyrics: {
        screen: CommentOnLyrics,
        navigationOptions: () => ({
          headerTitle: 'Comments',
          ...inNavConfig
        })
      },
      Search: {
        screen: FSearch,
        navigationOptions: () => ({
          ...inNavConfig
        })
    },
    AllComments: {
      screen: AllComments,
      navigationOptions: () => ({
        headerTitle: 'Comments',
        ...inNavConfig
      })
    },
    About: {
        screen: FAbout,
        navigationOptions: () => ({
            headerTitle: 'About',
          ...inNavConfig
        })
    },
      Login: {
          screen: FLogin,
          navigationOptions: () => ({
            headerTitle: 'Login',
            ...inNavConfig
          })
      },
      CreateAccount: {
        screen: FNewAccount,
        navigationOptions: () => ({
          headerTitle: 'Create Account',
          ...inNavConfig
        })
    },
    ConfirmAccount: {
        screen: FConfirmAccount,
        navigationOptions: () => ({
          headerTitle: 'Confirm Account',
          ...inNavConfig
        })
    },
    Profile: {
      screen: FProfile,
      navigationOptions: () => ({
        headerTitle: 'Profile',
        ...inNavConfig
      })
  },
  ChangeProfilePhoto: {
    screen: FChangePhoto,
    navigationOptions: () => ({
      headerTitle: 'Change Profile Photo',
      ...inNavConfig
    })
},
  },
  {
      mode: 'modal',
      headerMode: 'float',
      initialRouteName: 'Tab',
      headerTransitionPreset: 'fade-in-place',
  }
);


// Config for main Navigation Componenets
const navConfig = {
  headerStyle: {
      color: colors.purple,
      tintColor: colors.purple,
      elevation: 0,      
      shadowOpacity: 0,
      borderBottomWidth: 0,
  },
  headerTitleStyle: {
      color: colors.purple,
      fontWeight: 'normal'
  },
  headerTintColor: colors.purple,
}

// Config for in-stack navs
const inNavConfig = {
  headerStyle: {
      color: colors.purple,
      tintColor: colors.purple,
  },
  headerTitleStyle: {
      color: colors.purple,
      fontWeight: 'normal'
  },
  headerTintColor: colors.purple,
}




export default createAppContainer(mainNavigator);

