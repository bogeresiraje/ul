import React, { Component } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { getUser, logoutUser } from '../../../data/AccessControl';
import { FLoading } from '../FLoading';
import { FWrong } from '../FWrong';
import { FInputPrompt } from '../FInputPrompt';
import { FPrompt } from '../FPrompt';
import { FHeading } from '../FText';
import { FButton } from '../FButtons';
import { FContactPhotoClickable } from '../FContactPhoto';
import { colors } from '../../colors';
import { getApi, getAccessUrl } from '../../../data/api';
import layout from '../../styles/layout';
import { FPromptLogin } from '../Alert/FPromptLogin';


export class FProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            somethingWrong: false,
            activeIndicator: false,
            refreshing: false,
            notLoggedin: false,

            user: {},

            logoutPrompt: false, 
            deleteAccountPrompt: false,

            // Editing name
            editNameOpen: false,
            name: '',

            // Indicators.
            logingOut: false,
            deletingIndicator: false,
            nameIndicator: false,
        };
    }

    componentDidMount() {
        this._getUser();
    }

    _getUser = async () => {
        const email = await getUser();
        if(email) {
            this._submit(email);

        } else {
            this.setState({ loading: false, notLoggedin: true });
        }
    };

    // Submit post request to server
    _submit = email => {
        const formData = new FormData();
        formData.append('email', email);

        const url = getAccessUrl() + '/get_user';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ loading: false, user: response.user });
                } else {
                    this.setState({ loading: false, somethingWrong: true });
                }
            },
            () => this.setState({ loading: false, somethingWrong: true })
        )
        .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _refresh = () => {
        this.setState({ refreshing: true });

        const formData = new FormData();
        formData.append('email', this.state.user.email);
        const url = getAccessUrl() + '/get_user';

        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ refreshing: false, user: response.user });
                } else {
                    this.setState({ refreshing: false, somethingWrong: true });
                }
            },
            () => this.setState({ refreshing: false, somethingWrong: true })
        )
        .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    // Edit profile photo_name
    _changeProfilePhoto = () => {
        this.props.navigation.navigate('ChangeProfilePhoto');
    };


    // For editing name of the user
    _openEditName = () => {
        this.setState({ editNameOpen: true, name: this.state.user.name });
    };

    // Cancel editing name
    _cancelEditName = () => {
        this.setState({ editNameOpen: false });
    };

    _handleName = name => {
        this.setState({ name: name });
    };

    // Change user name in the database
    _editName = () => {
        const { user, name } = this.state;
        this.setState({ nameIndicator: true });
        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('name', name);

        const url = getAccessUrl() + '/edit_name';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ user: response.user, nameIndicator: false, editNameOpen: false });
                } else {
                    this.setState({ nameIndicator: false, editNameOpen: false, somethingWrong: true });
                }
            },
            () => this.setState({ nameIndicator: false, editNameOpen: false, somethingWrong: true })
        )
        .catch(() => this.setState({ nameIndicator: false, editNameOpen: false, somethingWrong: true }) )
    };


    // For logging out
    _openLogout = () => {
        this.setState({ logoutPrompt: true });
    };

    _cancelLogout = () => {
        this.setState({ logoutPrompt: false });
    };

    _logoutFromLocal = async () => {
        await logoutUser()
    };

    _logout = async () => {
        this.setState({ logingOut: true });
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
                    this.props.navigation.navigate('More');
                } else {
                    this.setState({ logoutPrompt: false, loggingOut: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ logoutPrompt: false, loggingOut: false, somethingWrong: true }) )
    };

    // For deleting account
    _openDeleteAccount = () => {
        this.setState({ deleteAccountPrompt: true });
    };

    _cancelDeleteAccount = () => {
        this.setState({ deleteAccountPrompt: false });
    };

    _deleteAccount = async () => {
        const email = await getUser();
        this.setState({ deletingIndicator: true });
        const formData = new FormData()
        formData.append('email', email);
        const url = getAccessUrl() + '/delete_account';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(
                response => {
                    if(response.success){
                        this._logoutFromLocal();
                        this.props.navigation.navigate('More');
                    } else {
                        this.setState({ somethingWrong: true, deletingIndicator: false });
                    }
                },
                () => this.setState({ somethingWrong: true, deletingIndicator: false })
            )
            .catch(() => this.setState({ somethingWrong: true, deletingIndicator: false }) )
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._getUser();
    };

    _cancelLogin = () => {
        this.props.navigation.goBack();
    };

    render() {
        const { loading, somethingWrong, refreshing, user, logoutPrompt, deleteAccountPrompt,
            editNameOpen, name, deletingIndicator, nameIndicator,
            logingOut, notLoggedin } = this.state;

        if(loading) {
            return (
                <View style={ layout.container } >
                    <FLoading loadingColor={ colors.purple } />
                </View>
            );

        } else if(notLoggedin) {
            return (
                <View style={ layout.container } >
                    <FPromptLogin title='You Need To Login To View Your Profile' 
                        navigation={ this.props.navigation } cancel={ this._cancelLogin }
                    />
                </View>
            );

        } else if(logingOut){
            // loging out indicator
            return (
                <View style={ layout.container } >
                    <FLoading title='Loging Out...' loadingColor={ colors.purple } />
                </View>
            );

        } else if(nameIndicator) {
            // Edit name indicator.
            return (
                <View style={ layout.container } >
                    <FLoading title='Editing Name...' loadingColor={ colors.purple } />
                </View>
            );

        } else if(deletingIndicator) {
            // Deleting account indicator.
            return (
                <View style={ layout.container } >
                    <FLoading title='Deleting Account...' loadingColor={ colors.purple } />
                </View>
            );

        } else if(somethingWrong) {
            return (
                <View style={ layout.container } >
                    <FWrong tryAgain={ this._tryAgain } />
                </View>
            );

        } else if(editNameOpen){
            // Edit name
            return (
                <View style={ layout.container } >
                    <FInputPrompt
                        title='Edit Name'
                        ok='UPDATE'
                        cancelable={ this._cancelEditName }
                        acceptable={ this._editName }
                        value={ name }
                        inputHandler={ this._handleName }
                    />
                </View>
            )

        } else if(logoutPrompt) {
            // Logout prompt
            return (
                <View style={ layout.container }>
                    <FPrompt
                    title='Are You Sure You Want To Logout?'
                    cancelable={ this._cancelLogout }
                    acceptable={ this._logout }
                />
                </View>
            )

        } else if(deleteAccountPrompt) {
            // Delete account
            return (
                <View style={ layout.container } >
                    <FPrompt
                        title='Are You Sure You Want To Delete Your Account?'
                        cancelable={ this._cancelDeleteAccount }
                        acceptable={ this._deleteAccount }
                    />
                </View>
            );

        } else {
            return (
                <ScrollView
                    refreshControl = {
                        <RefreshControl
                            refreshing={ refreshing }
                            onRefresh={ this._refresh }
                        />
                    }
                >
                    <UserInfo
                        user={ user }
                        navigation={ this.props.navigation }
                        changeProfilePhoto={ this._changeProfilePhoto }
                        changeIDPhoto={ this._changeIDPhoto }
                        openEditName={ this._openEditName }
                        openEditPhone={ this._openEditPhone }
                        openLogout={ this._openLogout }
                        openDeleteAccount={ this._openDeleteAccount }
                    /> 

                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
    }
}


const UserInfo = (props) => {
    const { user, changeProfilePhoto, openLogout,
        openDeleteAccount, openEditName } = props;

    return (
        <View style={ layout.containerWhite }>
            <View style={ layout.columnSeparator }>
                <View style={ layout.column60 }>
                    <FHeading title={ user.name }
                        headStyles={{ fontSize: 18, color: '#000', textAlign: 'left',
                        marginLeft: 20 }}
                    />
                </View>

                <View style={ layout.column40 }>
                    <FButton
                        handler={ openEditName }
                        title='edit'
                        buttonStyles={{ width: '60%', borderRadius: 10, height: 30 }}
                        textStyles={{ paddingTop: 2 }}
                    />
                </View> 
            </View>

            <FContactPhotoClickable
                title='Profile Photo'
                handler={ changeProfilePhoto }
                imageUrl={ `${getApi()}/uploads/profile/${user.photo_name}`}
                imageStyles={{ width: '90%', alignSelf: 'center' }}
            />

            <FButton
                title='Log Out'
                handler={ openLogout }
                buttonStyles={{ borderRadius: 10, width: '90%' }}
            />

            <FButton
                title='Delete Account'
                handler={ openDeleteAccount }
                buttonStyles={{ borderColor: colors.red, borderRadius: 10, width: '90%' }}
                textStyles={{ color: colors.red }}
            />
        </View>
    );
};

