import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { FLoading } from '../../res/custom/FLoading';
import { FWrong } from '../../res/custom/FWrong';
import { getApi } from '../../data/api';
import { CommentsList } from './CommentsList';
import input from '../../res/styles/input';
import { colors } from '../../res/colors';
import FIndicator from '../../res/custom/FIndicator';
import { FButton } from '../../res/custom/FButtons';
import { getUser } from '../../data/AccessControl';
import { FHeading } from '../../res/custom/FText';
import layout from '../../res/styles/layout';
import { FPromptLogin } from '../../res/custom/Alert/FPromptLogin';


export class CommentOnLyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            activeIndicator: false,
            song: {},
            comments: [],
            currComment: '',
            promptLogin: false,
        }
    }

    componentDidMount() {
        this._fetchLyricsComments();
    }

    _fetchLyricsComments = () => {
        const song = this.props.navigation.getParam('identifier');
        // Url
        const url = getApi() + '/get_all_lyrics_comments';
        fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({ lyrics_list: song.selectedLines }) 
        })
        .then(response => response.json())
        .then(response => {
            if(response.comments) {
                this.setState({ comments: response.comments, song: song, loading: false });
            } else {
                this.setState({ loading: false, somethingWrong: true })
            }
        })
        .catch((e) => this.setState({ loading: false, somethingWrong: true }) )
    };

    _refresh = () => {
        this.setState({ refreshing: true });
        const song = this.props.navigation.getParam('identifier');
        // Url
        const url = getApi() + '/get_all_lyrics_comments';
        fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({ lyrics_list: song.selectedLines }) 
        })
        .then(response => response.json())
        .then(response => {
            if(response.comments) {
                this.setState({ comments: response.comments, song: song, refreshing: false });
            } else {
                this.setState({ refreshing: false, somethingWrong: true })
            }
        })
        .catch((e) => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    _handleComment = comment => {
        this.setState({ currComment: comment });
    };

    _submit = async () => {
        // get user
        const email = await getUser();
        if(email === null) {
            this.setState({ promptLogin: true });
            return
        }

        this.setState({ activeIndicator: true });
        const { song, currComment } = this.state;
        // Curr date
        const date = new Date();

        // url
        const url = getApi() + '/add_lyrics_comment';
        fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                lyrics_list: song.selectedLines,
                body: currComment,
                created_time: date.toLocaleString()
            })
         })
        .then(response => response.json())
        .then(response => {
            if(response.comment) {
                this.setState({ activeIndicator: false, currComment: '',
                    comments: [ response.comment, ...this.state.comments ]
                })
            } else {
                this.setState({ activeIndicator: false, somethingWrong: true });
            }
        })
        .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }) )
    };

    _cancelLogin = () => {
        this.setState({ promptLogin: false });
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false, loading: true });
        this._fetchLyricsComments();
    };

    render() {
        const { loading, refreshing, somethingWrong, comments, song, activeIndicator, 
            promptLogin, currComment } = this.state;

        if(loading) {
            return <FLoading />;

        } else if (somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

        } else if(promptLogin) {
            return (
                <View style={ layout.container } >
                    <FPromptLogin title='You Need To Login To Comment' 
                        navigation={ this.props.navigation } cancel={ this._cancelLogin }
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
                    <CommentForm song={ song } numComments={ comments.length }  comments={ comments }
                        handleComment={ this._handleComment } currComment={ currComment }
                        activeIndicator={ activeIndicator } submit={ this._submit }
                    />
                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
    }
}

const CommentForm = (props) => {
    const { song, comments, numComments, handleComment, currComment, submit, activeIndicator } = props;

    return (
        <View style={ layout.container }>
            <Text style={ styles.title } >{ `${song.title} - ${song.artiste}` }</Text>
    
            <View>
                <FHeading title={ `${numComments} Comments`} headStyles={{ textAlign: 'left', fontSize: 15 }} />
                <TextInput onChangeText={ handleComment }
                    value={ currComment } style={{ ... input.inputText, borderRadius: 5 }}
                    returnKeyType='send' onSubmitEditing={ () => submit() }
                    placeholder='write comment.....'
                />
                
                <FlexBtn activeIndicator={ activeIndicator } submit={ submit } />
            </View>

            <CommentsList comments={ comments } />  
    
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

