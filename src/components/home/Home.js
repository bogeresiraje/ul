import React, { Component } from 'react';
import { ScrollView, View, Text, StatusBar, RefreshControl } from 'react-native';
import { FLoading } from '../../res/custom/FLoading';
import { FWrong } from '../../res/custom/FWrong';
import { colors } from '../../res/colors';
import { FInfo } from '../../res/custom/FInfo';
import layout from '../../res/styles/layout';
import { getApi } from '../../data/api';
import { FImageCard } from '../../res/custom/FImageCard';
import { isSongSaved } from '../../data/savedLyrics';


export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            lyricsList: [],
        }
    }

    componentDidMount() {
        this._fetchLyrics();
    }

    _fetchLyrics = async () => {
        const url = getApi() + '/get_songs';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data.songs) {
                    this.setState({ lyricsList: data.songs, loading: false });
                } else {
                    this.setState({ somethingWrong: true, loading: false });
                }
            })
            .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };

    _refresh = async () => {
        this.setState({ refreshing: true });
        const url = getApi() + '/get_songs';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data.songs) {
                    this.setState({ lyricsList: data.songs, refreshing: false });
                } else {
                    this.setState({ somethingWrong: true, refreshing: false });
                }
            })
            .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ loading: true, somethingWrong: false });
        this._fetchLyrics();
    };

    render() {
        const { loading, refreshing, somethingWrong, lyricsList } = this.state;

        if(loading) {
            return (
                <View style={ layout.container } >
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />
                    <FLoading />
                </View>
            );

        } else if(somethingWrong) {
            return (
                <View style={ layout.container } >
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />
                    <FWrong  tryAgain={ this._tryAgain } />
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
                    <StatusBar backgroundColor={ colors.purple } barStyle='light-content' />
                    <LyricsList lyricsList={ lyricsList } { ...this.props } />
                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
        
    }
}


const LyricsList = ({ lyricsList, navigation }) => {
    if(!lyricsList.length) {
        return <FInfo title='No Availble Lyrics' />

    } else {
        const { length } = lyricsList;
        const left = lyricsList.slice(0, Math.ceil(length / 2))
        const right = lyricsList.slice(Math.ceil(length / 2), length);
        return (
            <View style={ layout.columnSeparator }>
                <View style={ layout.column50 }>
                    <Column lyrics={ left } navigation={ navigation } />
                </View>
                <View style={ layout.column50 }>
                    <Column lyrics={ right } navigation={ navigation } />
                </View>
            </View>
        );
    }
}


const Column = ({ lyrics, navigation }) => lyrics.map(l => {
    const handler = async () => {
        const { id } = l;
        const saved = await isSongSaved(id);
        navigation.navigate('Lyrics', { song_id: id, saved: saved });
    };

    return (
        <FImageCard source={{ uri: `${getApi()}/uploads/images/${l.photo_name}`}}
            key={ l.id }
            title={ l.title }
            subtitle={ l.artiste }
            handler={ handler }
        />
    )
})
