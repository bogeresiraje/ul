import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FButton } from '../FButtons';
import { colors } from '../../colors';


export const FPromptLogin = ({ navigation, title='', cancel }) => {
    const toLogin = () => {
        navigation.navigate('Login');
    };

    const toCreateAccount = () => {
        navigation.navigate('CreateAccount');
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ title }</Text>
            <FButton title='Login' buttonStyles={{ backgroundColor: colors.purple, borderColor: colors.purple,
                width: '60%', borderRadius: 15 }} 
                textStyles={{ color: colors.white }}
                handler={ toLogin }
            />
            <Text style={ styles.or }>OR</Text>
            <FButton title='Create Account' buttonStyles={{ width: '60%', borderColor: colors.purple, borderRadius: 15 }} 
                textStyles={{ color: colors.purple }}
                handler={ toCreateAccount }
            />

            <Text style={ styles.or }>OR</Text>
            <FButton title='Cancel' buttonStyles={{ width: '60%', borderRadius: 15 }} 
                handler={ cancel }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 7,
        marginTop: 80,
    },
    or: {
        textAlign: 'center',
        color: '#888888',
    },
    title: {
        textAlign: 'center',
        color: '#888888',
    }
})
