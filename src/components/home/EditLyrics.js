import React, { Component } from 'react';
import { ScrollView, View, TextInput, Text, RefreshControl, StyleSheet } from 'react-native';
import { FLoading } from '../../res/custom/FLoading';
import { FWrong } from '../../res/custom/FWrong';
import { getApi } from '../../data/api';
import { EditList } from './EditList';
import { FButton } from '../../res/custom/FButtons';
import { FHeading } from '../../res/custom/FText';
import input from '../../res/styles/input';
import { colors } from '../../res/colors';
import { getUser } from '../../data/AccessControl';
import FIndicator from '../../res/custom/FIndicator';
import layout from '../../res/styles/layout';
import { FPrompt } from '../../res/custom/FPrompt';
import { FPromptLogin } from '../../res/custom/Alert/FPromptLogin';


export class EditLyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            activeIndicator: false,
            somethingWrong: false,
            editedLyrics: [],
            song: {},
            currLine: '',
            promptLogin: false,
        }
    }

    componentDidMount() {
        this._fetchEdits();
    }

    _fetchEdits = () => {
        const song = this.props.navigation.getParam('identifier');
        const formData = new FormData();
        formData.append('lyrics_id', song.lyrics_id)
        const url = getApi() + '/get_all_edited_lyrics';
        fetch(url, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(response => {
            if(response.edited_lyrics) {
                this.setState({ song: song, currLine: song.lyrics_line,
                    editedLyrics: response.edited_lyrics, loading: false,
                });
            } else {
                this.setState({ loading: false, somethingWrong: true });
            }
        })
        .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };


    _refresh = () => {
        this.setState({ refreshing: true });
        const song = this.props.navigation.getParam('identifier');
        const formData = new FormData();
        formData.append('lyrics_id', song.lyrics_id)
        const url = getApi() + '/get_all_edited_lyrics';
        fetch(url, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(response => {
            if(response.edited_lyrics) {
                this.setState({ song: song, currLine: song.lyrics_line,
                    editedLyrics: response.edited_lyrics, refreshing: false,
                });
            } else {
                this.setState({ refreshing: false, somethingWrong: true });
            }
        })
        .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    _handleLine = line => {
        this.setState({ currLine: line });
    };

    _submit = async () => {
        const user_email = await getUser();
        if(user_email === null) {
            this.setState({ promptLogin: true });
            return
        }

        this.setState({ activeIndicator: true });
        // Get user email
        const { song, currLine } = this.state;
        // Current time
        const date = new Date();
        // Create a form
        const formData = new FormData();
        formData.append('email', user_email);
        formData.append('lyrics_id', song.lyrics_id)
        formData.append('line', currLine);
        formData.append('created_time', date.toLocaleString());
        // Server url
        const url = getApi() + '/edit_lyrics';
        fetch(url, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(response => {
            if(response.edit) {
                const { editedLyrics } = this.state;
                this.setState({ activeIndicator: false, editedLyrics: [ response.edit, ...editedLyrics ] });
            } else {
                this.setState({ activeIndicator: false, somethingWrong: true });
            }
        })
        .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }) )

    };

    _cancelLogin = () => {
        this.setState({ promptLogin: false, currLine: '' });
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchEdits();
    };

    render() {
        const { loading, refreshing, somethingWrong, editedLyrics, song, currLine, activeIndicator,
            promptLogin } = this.state;

        if(loading) {
            return <FLoading />;

        } else if (somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

        } else if(promptLogin) {
            return (
                <View style={ layout.container } >
                    <FPromptLogin title='You Need To Login To Edit' cancel={ this._cancelLogin }
                        navigation={ this.props.navigation }
                    />
                </View>
            );
        } else {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={ refreshing }
                            onRefresh={ this._refresh }
                        />
                    }
                >
                    <EditForm numEdits={ editedLyrics.length } song={ song } currLine={ currLine } 
                        handleLine={ this._handleLine } submit={ this._submit }
                        activeIndicator={ activeIndicator } editedLyrics={ editedLyrics }
                    />
                    <View style={ layout.padBottom } ></View>
                </ScrollView>
            );
        }
    }
}


const EditForm = (props) => {
    const { song, handleLine, currLine, numEdits, submit, activeIndicator, editedLyrics } = props;

    return (
        <View style={ layout.container }>
            <Text style={ styles.title } >{ `${song.title} - ${song.artiste}` }</Text>
    
            <View>
                <FHeading title={ `${numEdits} Edits`} headStyles={{ textAlign: 'left', fontSize: 15 }} />
                <TextInput onChangeText={ handleLine }
                    value={ currLine } style={{ ... input.inputText, borderRadius: 5 }}
                    returnKeyType='send' onSubmitEditing={ () => submit() }
                />
                
                <FlexBtn activeIndicator={ activeIndicator } submit={ submit } />
            </View>

            <EditList edits={ editedLyrics } />

    
    
        </View>
    );
}; 


const FlexBtn = ({ activeIndicator, submit }) => {
    if(activeIndicator) {
        return (
            <FIndicator
                vStyles={{ width: '30%', alignSelf: 'flex-start', borderRadius: 5, 
                borderColor: colors.lightPurple, backgroundColor: colors.lightPurple }}
                bColor={ colors.lightPurple }
                color={ colors.white }
            />
        );
    } else {
        return (
            <FButton title='send' buttonStyles={{ width: '30%', alignSelf: 'flex-start', borderRadius: 5, 
                borderColor: colors.lightPurple, backgroundColor: colors.lightPurple }}
                textStyles={{ color: colors.white }}
                handler={ submit }
            />
        );
    }
};


const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#333333',
    },
    lyrics: {
        textAlign: 'center',
        color: colors.black,
    }
});

