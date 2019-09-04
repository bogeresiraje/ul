import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { FLoading } from '../../res/custom/FLoading';
import { FWrong } from '../../res/custom/FWrong';
import layout from '../../res/styles/layout';
import { colors } from '../../res/colors';
import { saveLyrics, getSavedSong, deleteSong, isSongSaved } from '../../data/savedLyrics';
import { getApi } from '../../data/api';
import { FButton, FIconButton } from '../../res/custom/FButtons';
import { FHeading } from '../../res/custom/FText';
import { CommentsList } from './CommentsList';
import input from '../../res/styles/input';
import { getUser } from '../../data/AccessControl';
import { FPromptLogin } from '../../res/custom/Alert/FPromptLogin';
import { LyricsList } from './LyricsList';
import text from '../../res/styles/text';


export class Lyrics extends Component {
            
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            activeIndicator: false,
            notLoggedIn: false,
            song: {},
            saved: null,
            currComment: '',
            numSelected: 0,
            selectedLines: [],
        };
    }

    static navigationOptions = ({ navigation }) => {
        const selected = navigation.state.params.numSelected;
        const { toEditLyrics, toCommentOnLyrics } = navigation.state.params;
        if(selected !== undefined) {
            if(selected === 0) {
                return {
                    headerTitle: 'Lyrics',
                }
            } else {
                return {
                    headerTitle: (
                        <View style={ layout.columnSeparator }>
                            <View style={ layout.column50 }>
                                <Text style={ { marginTop: 13 } }>{ selected }</Text>
                            </View>

                            <View style={ layout.column10 } >
                                {
                                    selected === 1 && <FIconButton source={ require('../../res/icons/edit.png')} 
                                        iconStyles={{ height: 25, width: 20 }}
                                        onPress={ toEditLyrics }
                                    />
                                }
                            </View>

                            <View style={ layout.column40 } >
                                <FIconButton source={ require('../../res/icons/forum.png')} 
                                    iconStyles={{ height: 25, width: 25 }}
                                    onPress={ toCommentOnLyrics }
                                />
                            </View>
                        </View>
                    )
                }
            }
        } else {
            return {
                headerTitle: 'Lyrics',
            }
        }
    }

    componentDidMount() {
        const saved = this.props.navigation.getParam('saved');
        this.props.navigation.setParams({ toEditLyrics: this._toEditLyrics,
            toCommentOnLyrics: this._toCommentOnLyrics
         })
        if(saved === true) {
            this._loadFromLocal();
        } else {
            this._fetchLyrics();
        }
        this.setState({ saved: saved });
    }

    _loadFromLocal = async () => {
        const song_id = this.props.navigation.getParam('song_id');
        const song = await getSavedSong(song_id);
        if(song === null) {
            this.setState({ alreadyDeleted: true, loading: false });
        } else {
            this.setState({ song: song, loading: false });
        }
    };

    _fetchLyrics = () => {
        const song_id = this.props.navigation.getParam('song_id');
        const formData = new FormData();
        formData.append('song_id', song_id);
        // Url.
        const url = getApi() + '/get_song';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if(data.song) {
                    this.setState({ song:data.song, loading: false });
                } else {
                    this.setState({ somethingWrong: true, loading: false });
                }
            })
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _refresh = () => {
        this.setState({ refreshing: true });
        const song_id = this.props.navigation.getParam('song_id');
        const formData = new FormData();
        formData.append('song_id', song_id);
        // Url.
        const url = getApi() + '/get_song';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if(data.song) {
                    this.setState({ song:data.song, refreshing: false });
                } else {
                    this.setState({ somethingWrong: true, refreshing: false });
                }
            })
            .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    }

    _saveOffline = async () => {
        const { song } = this.state;
        const savedSong = await saveLyrics(song);
        if(savedSong.id === song.id) {
            this.setState({ saved: true });
        }
    };

    _deleteOffline = async () => {
        const { song } = this.state;
        await deleteSong(song.id);
        const saved = await isSongSaved(song.id);
        this.setState({ saved: saved });
    };

    _handleComment = curr => {
        this.setState({ currComment: curr });
    };

    _submitComment = async () => {
        const email = await getUser();
        if(email === null) {
            this.setState({ notLoggedIn: true, loading: false });
            return
        }

        const formData = new FormData();
        const date = new Date();
        formData.append('email', email);
        formData.append('song_id', this.state.song.id);
        formData.append('body', this.state.currComment);
        formData.append('created_time', date.toLocaleString())
        // Submit
        const url = getApi() + '/add_comment';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.num_comments) {
                    const { song } = this.state;
                    const { num_comments, latest_comments } = response;
                    song.num_comments = num_comments;
                    song.latest_comments = latest_comments;
                    this.setState({ activeIndicator: false, song: song, currComment: '' });
                } else {
                    this.setState({ somethingWrong: true, activeIndicator: false, currComment: '' });
                }
            })
            .catch(() =>  this.setState({ somethingWrong: true, activeIndicator: false, currComment: '' }) )
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchLyrics();
    };

    _cancelLogin = () => {
        this.setState({ loading: false, notLoggedIn: false, currComment: '' });
    };

    // For commenting and editing lines of lyrics
    _toggleSelected = (lyrics_id, line, selected) => {
        if(selected) {
            // Remove from selected
            const { song, numSelected, selectedLines } = this.state;
            const newLyrics = song.lyrics.filter(line => {
                if(line.id === lyrics_id){
                    line.selected = false
                    return line;
                } else {
                    return line;
                }
            })
            song.lyrics = newLyrics;
            const selected = numSelected - 1;
            this.setState({ song: song, numSelected: selected,
                selectedLines: selectedLines.filter(selected => selected.id !== lyrics_id )
            });
            this.props.navigation.setParams({ numSelected: selected });


        } else {
            // Add to selected
            const { song, numSelected, selectedLines } = this.state;
            const newLyrics = song.lyrics.filter(line => {
                if(line.id === lyrics_id){
                    line.selected = true;
                    return line;
                } else {
                    return line;
                }
            })
            song.lyrics = newLyrics;
            const selected = numSelected + 1;

            const newSelected = {
                id: lyrics_id,
                line: line,
            }

            this.setState({ song: song, numSelected: selected,
                selectedLines: [ newSelected, ...selectedLines ]
            });
            this.props.navigation.setParams({ numSelected: selected });

        }
    };

    _toEditLyrics = () => {
        const { song, selectedLines } = this.state;
        const identifier = {
            title: song.title,
            artiste: song.artiste,
            lyrics_line: selectedLines[0].line,
            lyrics_id: selectedLines[0].id,
        }
        this.props.navigation.navigate('EditLyrics', { identifier: identifier });
    };

    _toCommentOnLyrics = () => {
        const { song, selectedLines } = this.state;
        const identifier = {
            title: song.title,
            artiste: song.artiste,
            selectedLines: selectedLines
        };
        this.props.navigation.navigate('CommentOnLyrics', { identifier: identifier });
    };

    render() {
        const { loading, refreshing, somethingWrong, song, saved, currComment, notLoggedIn } = this.state;

        if(loading) {
            return <FLoading />;

        } else if(notLoggedIn) {
            return (
                <View style={ styles.container } >
                    <FPromptLogin title='You Need To Login In Order To Create A Comment' 
                        navigation={ this.props.navigation } cancel={ this._cancelLogin }
                    />
                </View>
            );

        } else if(somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

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
                    <LyricsPage song={ song } saved={ saved } saveOffline={ this._saveOffline } 
                        deleteOffline={ this._deleteOffline } currComment={ currComment }
                        handleComment={ this._handleComment } navigation={ this.props.navigation }
                        submitComment={ this._submitComment } isSelected={ this._isSelected }
                        toggleSelected={ this._toggleSelected }
                    />
                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
    }
}


const LyricsPage = (props) => {
    const { navigation, song, saved, saveOffline, deleteOffline, handleComment, currComment,
         submitComment, isSelected, toggleSelected } = props;

    return (
        <View style={ layout.container }>
            <Text style={ styles.title } >{ `${song.title} - ${song.artiste}` }</Text>
            <FlexButton saved={ saved } saveOffline={ saveOffline } deleteOffline={ deleteOffline } />
            
            <LyricsList lyricsList={ song.lyrics } isSelected={ isSelected } toggleSelected={ toggleSelected } />
    
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
                <CommentsList comments={ song.latest_comments } />
    
                <AllCommentsButton navigation={ navigation } song_id={ song.id } num_comments={ song.num_comments } />
            </View>
    
    
        </View>
    );
}


const FlexButton = ({ saved, saveOffline, deleteOffline }) => {
    if(saved) {
        return (
            <FButton title='saved'
            buttonStyles={{ width: '40%', borderRadius: 15, height: 30, borderColor: colors.green }}
            textStyles={{ paddingTop: 0, color: colors.green }}
            handler={ deleteOffline }
            />
        );
    } else {
        return (
            <FButton title='save'
            buttonStyles={{ width: '40%', borderRadius: 15, height: 30, borderColor: colors.blue }}
            textStyles={{ paddingTop: 0, color: colors.blue }}
            handler={ saveOffline }
        />
        );
    }
};


const AllCommentsButton = ({ navigation, song_id, num_comments }) => {
    const to_all_comments = () => {
        navigation.navigate('AllComments', { song_id: song_id })
    };

    if(num_comments > 5) {
        return (
            <FButton title='View All Comments' buttonStyles={{ borderRadius: 15, width: '70%', 
                borderColor: colors.purple, alignSelf: 'flex-start' }}
                textStyles={{ color: colors.purple }}
                handler={ to_all_comments }
            />
        );
    } else {
        return null;
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
