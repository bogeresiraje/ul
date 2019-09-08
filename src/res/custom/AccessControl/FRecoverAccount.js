import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FWrong } from '../FWrong';
import layout from '../../styles/layout';
import text from '../../styles/text';
import input from '../../styles/input';
import { NullInputAlert, TextAlert } from '../FText';
import { FButton } from '../FButtons';
import { colors } from '../../colors';
import { getAccessUrl, getApi } from '../../../data/api';
import FIndicator from '../FIndicator';
import { FRoundImage } from '../FImages';


export class FRecoverAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndicator: false,
            somethingWrong: false,
            email: '',
            noUser: false,
            nullEmail: false,
            user: {},
            // Handle code
            code: '',
            nullCode: false,
            wrongCode: false,
            invalidCode: false,
        };
    }

    _handleEmail = email => {
        this.setState({ email: email });
    };

    _submit = () => {
        const { email } = this.state;
        this.setState({ activeIndicator: true, noUser: false });
        if(email) {
            // Send email
            const formData = new FormData();
            formData.append('email', email);
            const url = getAccessUrl() + '/recover_account';
            fetch(url, { method: 'POST', body: formData})
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ activeIndicator: false, user: response.user });
                } else if(response.no_user) {
                    this.setState({ activeIndicator: false, noUser: true });
                } else {
                    this.setState({ activeIndicator: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }));
        } else {
            this.setState({ nullEmail: true, activeIndicator: false });
        }
    };

    _handleCode = code => {
        this.setState({ code: code });
    };

    _submitCode = () => {
        const { code } = this.state;
        if(!code) {
            this.setState({ nullCode: true });
            return
        }
        this.setState({ activeIndicator: true });
        const formData = new FormData();
        formData.append('code', code);
        const url = getAccessUrl() + '/confirm_recover_email';
        fetch(url, { method: 'POST', mode: 'cors', body: formData })
        .then(response => response.json())
        .then(response => {
            if(response.email) {
                this.props.navigation.navigate('ResetPassword', { email: response.email });
            } else if(response.invalid_code) {
                this.setState({ invalidCode: true, activeIndicator: false, wrongCode: false })
            } else if(response.wrong_code) {
                this.setState({ activeIndicator: false, wrongCode: true, invalidCode: false });
            } else {
                this.setState({ activeIndicator: false, somethingWrong: true });
            }
        })
        .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false });
    };

    render() {
        const { somethingWrong, email, nullEmail, activeIndicator, noUser, user, code, nullCode, wrongCode, invalidCode } = this.state;

        if(somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

        } else if(user.id) {
            return (
                <View style={ { ...layout.container, padding: 15 } } >
                    <View style={ layout.columnSeparator } >
                        <View>
                            <FRoundImage source={{ uri: `${getApi()}/uploads/profile/${user.photo_name}` }} />
                        </View>
                        <View>
                            <Text style={ styles.title } >{ user.name }</Text>
                        </View>
                    </View>

                    <Text style={{ marginBottom: 10, marginTop: 10 }}>
                        If This Is Your Account, Enter The Unique Code That Has Been Sent To Your Email.
                    </Text>

                    <Text style={ text.autoText }>Code</Text>
                    <NullInputAlert value={ code } nullField={ nullCode } />
                    { wrongCode && <Text style={{ color: 'red', textAlign: 'center' }}>Wrong Code</Text> }
                    { invalidCode && <Text style={{ color: 'red', textAlign: 'center' }}>Invalid Code</Text> }
                    <TextInput style={ input.inputText } keyboardType='number-pad' value={ code }
                        onChangeText={ code => this._handleCode(code) }
                    />
                    <FlexButton activeIndicator={ activeIndicator } submit={ this._submitCode } />
                    
                </View>
            );

        } else {
            return (
                <View style={ layout.container }>
                    <Text style={ text.autoText }>
                        Enter your email to search for your Account
                    </Text>
                    <NullInputAlert nullField={ nullEmail } value={ email } />
                    <TextAlert title='User Account For The Given Email Is Not Found' value={ noUser } />
                    <TextInput value={ email } style={ input.inputText }
                        onChangeText={ email => this._handleEmail(email) }
                        keyboardType='email-address' autoCapitalize='none'
                        returnKeyType='send' onSubmitEditing={ this._submit }
                    />

                    <FlexButton activeIndicator={ activeIndicator } submit={ this._submit } />
                    
                </View>
            );
        }
    }
}


const FlexButton = ({ activeIndicator, submit }) => {
    if(activeIndicator) {
        return (
            <FIndicator color={ colors.white } bColor={ colors.purple }
                vStyles={{ width: '60%', alignSelf: 'center' }}
            />
        );
    } else {
        return (
            <FButton buttonStyles={{ alignSelf: 'center', width: '60%', borderColor: colors.purple, 
                backgroundColor: colors.purple }} 
                textStyles={{ color: 'white' }}
                handler={ submit }
            />
        );
    }
};


const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        color: '#333',
        padding: 7,
        paddingTop: 10,
    },
})

