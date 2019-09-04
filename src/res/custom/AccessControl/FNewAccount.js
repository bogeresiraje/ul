import React, { Component } from 'react';
import { TextInput, ScrollView, View, Text } from 'react-native';
import { FWrong } from '../FWrong';
import { NullInputAlert, TextAlert } from '../FText';
import text from '../../styles/text';
import input from '../../styles/input';
import { FButton } from '../FButtons';
import FIndicator from '../FIndicator';
import { colors } from '../../colors';
import { getAccessUrl } from '../../../data/api';
import layout from '../../styles/layout';


export class FNewAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somethingWrong: false,
            activeIndicator: false,
            invalidEmail: false,
            nullField: false,

            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    _handleUsername = username => {
        this.setState({ username: username });
    };

    _handleEmail = email => {
        this.setState({ email: email });
    };

    _handlePassword = password => {
        this.setState({ password: password });
    };

    _handleConfirmPassword = confirmPassword => {
        this.setState({ confirmPassword: confirmPassword });
    };

    _passwordsMatch = () => {
        const { password, confirmPassword } = this.state;
        return password === confirmPassword;
    };

    _validateAndSubmit = () => {
        const { username, email, password, confirmPassword } = this.state;
        // Check if all fields are filled out
        if(username && email && password && confirmPassword && this._passwordsMatch() ){
            this._submit(username, email, password);
        } else {
            this.setState({ nullField: true });
        }
    };

    _submit = (username, email, password ) => {
        this.setState({ activeIndicator: true });

        const formData = new FormData();
        formData.append('name', username);
        formData.append('email', email);
        formData.append('password', password);

        // Create account
        const url = getAccessUrl() + '/create_account';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.invalid_email) {
                    this.setState({ activeIndicator: false, invalidEmail: true });

                } else if(response.fail) {
                    this.setState({ activeIndicator: false, somethingWrong: true });

                } else {
                    this.setState({ activeIndicator: false });
                    this.props.navigation.navigate('ConfirmAccount');
                }
            })
            .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }))
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false });
    };

    render() {
        const { somethingWrong, activeIndicator, nullField, username, email, password,
            confirmPassword, invalidEmail } = this.state;

        if(somethingWrong){
            return (
                <View style={ layout.container } >
                    <FWrong tryAgain={ this._tryAgain } />
                </View>
            );

        } else {
            return (
                <ScrollView>
                    <Form
                        nullField={ nullField }
                        navigation={ this.props.navigation }
                        activeIndicator={ activeIndicator }
                        invalidEmail={ invalidEmail }
                        username={ username }
                        email={ email }
                        password={ password }
                        confirmPassword={ confirmPassword }
                        handleUsername={ this._handleUsername }
                        handleEmail={ this._handleEmail }
                        handlePassword={ this._handlePassword }
                        handleConfirmPassword={ this._handleConfirmPassword }
                        passwordsMatch={ this._passwordsMatch }
                        validateAndSubmit={ this._validateAndSubmit }
                    />
    
                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
    }
}


const Form = (props) => {
    const { activeIndicator, nullField, username, email, password, confirmPassword,
        handleUsername, handleEmail, handlePassword, handleConfirmPassword,
        validateAndSubmit, navigation, passwordsMatch, invalidEmail } = props;

    const gotoConfirmAccount = () => {
        navigation.navigate('ConfirmAccount');
    };

    return (
        <View style={ { ...layout.container, paddingTop: 40 } }>
            <Text style={{ ...text.autoText, marginTop: 10 }}>Name</Text>
            <NullInputAlert nullField={ nullField } value={ username } />
            <TextInput
                style={{...input.inputText, marginBottom: 20 }}
                value={ username }
                autoCapitalize='words'
                onChangeText={ username => handleUsername(username) }
            />

            <Text style={{ ...text.autoText, marginTop: 10 }}>Email</Text>
            <NullInputAlert nullField={ nullField } value={ email } />
            <TextAlert value={ invalidEmail } title='Invalid Email' />
            <TextInput
                style={{...input.inputText, marginBottom: 20 }}
                autoCapitalize='none'
                keyboardType='email-address'
                value={ email }
                onChangeText={ email => handleEmail(email) }
            />

            <Text style={{ ...text.autoText, marginTop: 10 }}>Password</Text>
            <NullInputAlert nullField={ nullField } value={ password } />
            <TextInput
                style={{...input.inputText, marginBottom: 20 }}
                secureTextEntry
                value={ password }
                onChangeText={ password => handlePassword(password) }
            />

            <Text style={{ ...text.autoText, marginTop: 10 }}>Confirm Password</Text>
            <NullInputAlert nullField={ nullField } value={ confirmPassword } />
            <NonMatchPasswords value={ confirmPassword } passwordsMatch={ passwordsMatch } />
            <TextInput
                style={{...input.inputText, marginBottom: 20 }}
                secureTextEntry
                value={ confirmPassword }
                onChangeText={ confirmPassword => handleConfirmPassword(confirmPassword) }
                returnKeyType='send'
                onSubmitEditing={ () => validateAndSubmit() }
            />

            <SubmitBtn activeIndicator={ activeIndicator } validateAndSubmit={ validateAndSubmit } />

            <Text style={ text.autoText }>Already Received Code?</Text>

            <FButton
                title='Continue'
                handler={ gotoConfirmAccount  }
                buttonStyles={{ borderColor: colors.purple, width: '60%', borderRadius: 10 }}
                textStyles={{ color: colors.purple }}
            />
        </View>
    );
};


const NonMatchPasswords = ({ value, passwordsMatch }) => {
    if(value){
        if(passwordsMatch()){
            return <Text style={{ ...text.autoText, color: colors.green }}>Passwords Match</Text>;
        } else {
            return <Text style={{ ...text.autoText, color: colors.red }}>Passwords Don't Match</Text>;
        }
    } else {
        return null;
    }
};


const SubmitBtn = ({ activeIndicator, validateAndSubmit }) => {
    if(activeIndicator) {
        return (
            <FIndicator bColor={ colors.purple } color={ colors.white } />
        );
    } else {
        return (
            <FButton
                handler={ validateAndSubmit }
                buttonStyles={{ borderColor: colors.purple, backgroundColor: colors.purple }}
                textStyles={{ color: colors.white }}
            />
        );
    }
};
