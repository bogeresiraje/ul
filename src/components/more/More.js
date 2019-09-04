import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Linking } from 'react-native';
import layout from '../../res/styles/layout';
import { isLoggedIn, getUser, logoutUser } from '../../data/AccessControl';
import { FIcon } from '../../res/custom/FImages';
import { colors } from '../../res/colors';
import { getAccessUrl } from '../../data/api';
import { FLoading } from '../../res/custom/FLoading';
import { FPrompt } from '../../res/custom/FPrompt';
import { FWrong } from '../../res/custom/FWrong';


export class More extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somethingWrong: false,
            loggedin: null,
            logoutPrompt: false,
            loggingOut: false,
        };
        this.willFocus = this.props.navigation.addListener(
            'willFocus',
            () => this._isLoggedIn()
        )
    }

    componentWillMount() {
        this._isLoggedIn();
    }

    _isLoggedIn = async () => {
        const loggedin = await isLoggedIn();
        this.setState({ loggedin: loggedin });
    };

    _to_logout = () => {
        this.setState({ logoutPrompt: true });
    };

    _cancel_logout = () => {
        this.setState({ logoutPrompt: false });
    };

    _logoutFromLocal = async () => {
        await logoutUser()
    };

    _logout = async () => {
        this.setState({ loggingOut: true });
        const user = await getUser();
        const formData = new FormData();
        formData.append('email', user);
        // Submit
        const url = getAccessUrl() + '/logout';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    this._logoutFromLocal();
                    this.setState({ logoutPrompt: false, loggedin: false, loggingOut: false });
                } else {
                    this.setState({ logoutPrompt: false, loggingOut: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ logoutPrompt: false, loggingOut: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false });
    };

    render() {
        const { somethingWrong, loggingOut, logoutPrompt, loggedin } = this.state;
        const aboutIcon = require('../../res/icons/about.png');
        const createAccountIcon = require('../../res/icons/profile.png');
        const profileIcon = require('../../res/icons/profile.png');
        const sendIcon = require('../../res/icons/send.png');

        // Navigations
        const navigate_to = page => {
            this.props.navigation.navigate(page);
        }

        const openEmail = () => {
            const url = 'mailto:ulyrics2019@gmail.com';
            Linking.canOpenURL(url)
                .then(supported => {
                    if(supported){
                        return Linking.openURL(url);
                    } else {
                        // To do
                    }
                })
                .catch((err) => {
                    // To do
                } )
        };

        if(somethingWrong) {
            return (
                <FWrong tryAgain={ this._tryAgain } />
            );

        } else if(loggingOut) {
            return (
                <View style={ layout.container } >
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />
                    <FLoading title='Logging Out' />
                </View>
            );

        } else if(logoutPrompt) {
            return (
                <View style={ layout.container } >
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />
                    <FPrompt cancelable={ this._cancel_logout } acceptable={ this._logout }
                        title='Are You Sure You Want To Logout?'
                    />
                </View>
            );

        } else {
            return (
                <ScrollView>
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />

                    <View style={ layout.container } >
                        <LoginPane loggedin={ loggedin } navigate_to={ navigate_to } toLogout={ this._to_logout } />

                        <TouchableOpacity style={ styles.tile } onPress={ () => navigate_to('CreateAccount') } >
                            <View >
                                <FIcon source={ createAccountIcon } iconStyles={{ tintColor: colors.pink }} />
                            </View>
                            <View>
                                <Text style={ styles.text }>Create New Account</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={ styles.tile } onPress={ () => navigate_to('Profile') }  >
                            <View >
                                <FIcon source={ profileIcon } iconStyles={{ tintColor: colors.lemonGreen }} />
                            </View>
                            <View>
                                <Text style={ styles.text } >Profile</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={ styles.tile } onPress={ () => openEmail() } >
                            <View >
                                <FIcon source={ sendIcon } />
                            </View>
                            <View>
                                <Text style={ styles.text } >Send Us Feedback</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={ styles.tile } onPress={ () => navigate_to('About') }>
                            <View >
                                <FIcon source={ aboutIcon } iconStyles={{ tintColor: colors.lightPurple }} />
                            </View>
                            <View>
                                <Text style={ styles.text }>About</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        }
    }
}


const LoginPane = ({ loggedin, navigate_to, toLogout }) => {
    const logoutIcon = require('../../res/icons/logout.png');
    const loginIcon = require('../../res/icons/login.png');

    if(loggedin) {
        return (
            <TouchableOpacity style={ styles.tile } onPress={ () => toLogout() } >
                <View >
                    <FIcon source={ logoutIcon } iconStyles={{ tintColor: colors.red, height: 30 }} />
                </View>
                <View>
                    <Text style={ styles.text } >Logout</Text>
                </View>
            </TouchableOpacity>
        );

    } else {
        return (
            <TouchableOpacity style={ styles.tile } onPress={ () => navigate_to('Login') }>
                <View >
                    <FIcon source={ loginIcon } iconStyles={{ tintColor: colors.green, height: 30 }} />
                </View>
                <View>
                    <Text style={ styles.text }>Login</Text>
                </View>
            </TouchableOpacity>
        );
    }
};


const styles = StyleSheet.create({
    tile: {
        ...layout.columnSeparator,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
    },
    text: {
        paddingTop: 9,
        paddingLeft: 7,
        color: colors.black,
    }
})
