import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { FWrong } from '../FWrong';
import input from '../../styles/input';
import FIndicator from '../FIndicator';
import { colors } from '../../colors';
import { FButton } from '../FButtons';
import { getAccessUrl } from '../../../data/api';
import { NullInputAlert, FText } from '../FText';
import layout from '../../styles/layout';


export class FChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndicator: false,
            somethingWrong: false,
            newPassword: '',
            confirmNewPassword: '',
            nullInput: false,
            promptLogin: false,
        };
    }

    _passwordsMatch = () => {
        const { newPassword, confirmNewPassword } = this.state;
        if(newPassword === confirmNewPassword ) return true;
        return false;
    };

    _handleNewPassword = pass => {
        this.setState({ newPassword: pass });
    };

    _handleConfirmNewPassword = pass => {
        this.setState({ confirmNewPassword: pass });
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false, activeIndicator: false });
    };

    _submit = () => {
        const { newPassword, confirmNewPassword } = this.state;
        // Both passwords fields should be filled
        if(!(newPassword && confirmNewPassword )) {
            this.setState({ nullInput: true });
            return;
        }

        // If passwords don't match, do nothing and return from the function.
        if(!this._passwordsMatch()) return;

        this.setState({ activeIndicator: true });
        const email = this.props.navigation.getParam('email');
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', newPassword);
        // Url
        const url = getAccessUrl() + '/change_password';
        fetch(url, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if(data.success) this.setState({ activeIndicator: false, promptLogin: true });
            else this.setState({ somethingWrong: true, activeIndicator: false });
        })
        .catch(() => this.setState({ somethingWrong: true, activeIndicator: false }) )
    };

    render() {
        const { activeIndicator, somethingWrong, newPassword, confirmNewPassword, nullInput, promptLogin } = this.state;

        if(somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

        } else if(promptLogin) {
            return (
                <View style={{ ...layout.container, padding: 50 }}>
                    <FText title='Your Account Password Has Been Successfully Changed' />
                    <FText title='You Now Log In With Your New Password.' />
                    <FButton buttonStyles={{ borderColor: colors.purple, alignSelf: 'center', width: '60%', 
                        borderRadius: 5 }}
                        textStyles={{ color: colors.purple }}
                        handler={ () => this.props.navigation.navigate('Login') }
                    />
                </View>
            );

        } else {
            return (
                <ScrollView style={{ ...layout.container, paddingTop: 50 }}>
                    <View>
                    <Text style={{ color: '#333333', textAlign: 'center'}}>New Password</Text>
                    <NullInputAlert nullField={ nullInput } value={ newPassword } />
                    <TextInput style={ input.inputText } value={ newPassword }
                        onChangeText={ pass => this._handleNewPassword(pass) }
                        secureTextEntry
                    />

                    <Text style={{ color: '#333333', textAlign: 'center'}} >Confirm New Password</Text>
                    <NullInputAlert nullField={ nullInput } value={ confirmNewPassword } />
                    <NoPasswordMatch value={ confirmNewPassword } passwordsMatch={ this._passwordsMatch } />
                    <TextInput style={ input.inputText } value={ confirmNewPassword }
                        onChangeText={ pass => this._handleConfirmNewPassword(pass) }
                        secureTextEntry returnKeyType='send' onSubmitEditing={ this._submit }
                    />

                    <FlexButton activeIndicator={ activeIndicator } submit={ this._submit } />
                    </View>
                </ScrollView>
            );
        }
    }
}


const FlexButton = ({ activeIndicator, submit }) => {
    if(activeIndicator) {
        return (
            <FIndicator color='white' bColor={ colors.purple }
                vStyles={{ width: '60%', alignSelf: 'center' }}
            />
        );
    } else {
        return (
            <FButton buttonStyles={{ backgroundColor: colors.purple, borderColor: colors.purple,
                    width: '60%', alignSelf: 'center' }}
                textStyles={{ color: 'white' }}
                handler={ submit }
            />
        );
    }
};


const NoPasswordMatch = ({ value, passwordsMatch }) => {
    if(value) {
        if(passwordsMatch()) return <FText title='passwords match' textStyles={{ color: 'green' }} />;
        else return <FText title='passwords do not match' textStyles={{ color: 'red' }} />;
    } else {
        return null;
    }
}
