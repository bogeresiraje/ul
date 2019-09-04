import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { getApi } from '../../data/api';
import layout from '../../res/styles/layout';
import { FLoading } from '../../res/custom/FLoading';
import { FWrong } from '../../res/custom/FWrong';
import { CommentsList } from './CommentsList';
import { colors } from '../../res/colors';
import { FHeading } from '../../res/custom/FText';
import { FButton } from '../../res/custom/FButtons';
import { getUser } from '../../data/AccessControl';
import { FPromptLogin } from '../../res/custom/Alert/FPromptLogin';


export class AllComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            notLoggedin: false,
            song: {},
            currComment: '',
        };
    }

    componentDidMount() {
        this._fetchAllComments();
    }

    _fetchAllComments = () => {
        const song_id = this.props.navigation.getParam('song_id');
        const formData = new FormData();
        formData.append('song_id', song_id);

        const url = getApi() + '/get_all_comments';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if(data.song) {
                    this.setState({ loading: false, song: data.song });
                } else {
                    this.setState({ loading: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _refresh = () => {
        this.setState({ refreshing: true });
        const song_id = this.props.navigation.getParam('song_id');
        const formData = new FormData();
        formData.append('song_id', song_id);

        const url = getApi() + '/get_all_comments';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if(data.song) {
                    this.setState({ refreshing: false, song: data.song });
                } else {
                    this.setState({ refreshing: false, somethingWrong: true });
                }
            })
            .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    _handleComment = curr => {
        this.setState({ currComment: curr });
    };

    _submitComment = async () => {
        const email = await getUser();
        if(email === null) {
            this.setState({ notLoggedin: true, loading: false });
            return
        }

        const formData = new FormData();
        const date = new Date();
        formData.append('email', email);
        formData.append('song_id', this.state.song.id);
        formData.append('body', this.state.currComment);
        formData.append('created_time', date.toLocaleString())
        // Submit
        const url = getApi() + '/add_normal_comment';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.num_comments) {
                    const { song } = this.state;
                    const { num_comments, comment } = response;
                    song.num_comments = num_comments;
                    song.comments = [comment, ...song.comments];
                    this.setState({ activeIndicator: false, song: song, currComment: '' });
                } else {
                    this.setState({ somethingWrong: true, activeIndicator: false, currComment: '' });
                }
            })
            .catch(() =>  this.setState({ somethingWrong: true, activeIndicator: false, currComment: '' }) )
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false, loading: true });
        this._fetchAllComments();
    };

    _cancelLogin = () => {
        this.setState({ loading: false, notLoggedin: false, currComment: '' });
    };

    render() {
        const { loading, refreshing, somethingWrong, notLoggedin, song, currComment } = this.state;

        if(loading) {
            return (
                <View style={ layout.container } >
                    <FLoading />
                </View>
            );
        } else if(notLoggedin) {
            return (
                <View style={ styles.container } >
                    <FPromptLogin title='You Need To Login In Order To Create A Comment' 
                        navigation={ this.props.navigation } cancel={ this._cancelLogin }
                    />
                </View>
            );

        } else if(somethingWrong) {
            return (
                <View style={ layout.container } >
                    <FWrong tryAgain={ this._tryAgain } />
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
                    <Page
                        song={ song } handleComment={ this._handleComment } currComment={ currComment }
                        submitComment={ this._submitComment }
                    />
                    <View style={ layout.padBottom } ></View>
                </ScrollView>
            );
        }
    }
}


const Page = ({ song, handleComment, currComment, submitComment }) => (
    <View style={ layout.container }>
        <Text style={ styles.title } >{ `${song.title} - ${song.artiste}` }</Text>

        <View style={ layout.container }>
            <FHeading title={ `${song.num_comments} Comments`} headStyles={{ textAlign: 'left', fontSize: 15 }} />
            <TextInput placeholder='write comment .....' onChangeText={ handleComment }
                value={ currComment } style={{ ... input.inputText, borderRadius: 5 }}
                returnKeyType='send' onSubmitEditing={ () => submitComment() }
            />
            <FButton title='send' buttonStyles={{ width: '30%', alignSelf: 'flex-start', borderRadius: 5, 
                borderColor: colors.lightPurple, backgroundColor: colors.lightPurple }}
                textStyles={{ color: colors.white }}
                handler={ submitComment }
            />
            <CommentsList comments={ song.comments } />
        </View>


    </View>
);


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
