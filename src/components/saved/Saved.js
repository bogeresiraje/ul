import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getSavedLyrics, isSongSaved } from '../../data/savedLyrics';
import { FLoading } from '../../res/custom/FLoading';
import { FInfo } from '../../res/custom/FInfo';
import { getApi } from '../../data/api';
import layout from '../../res/styles/layout';
import { colors } from '../../res/colors';


export class Saved extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            lyricsList: [],
        };
        this.willFocus = this.props.navigation.addListener(
            'willFocus',
            () => this._loadSavedLyrics()
        )
    }

    componentDidMount() {
        this._loadSavedLyrics();
    }

    _loadSavedLyrics = async () => {
        const savedLyrics = await getSavedLyrics();
        this.setState({ savedLyrics: savedLyrics, loading: false });
    };

    render() {
        const { loading, savedLyrics } = this.state;

        if(loading) {
            return <FLoading />;

        } else {
            return <LyricsList lyrics={ savedLyrics } navigation={ this.props.navigation } />;

        }
    }
}


export const LyricsList = ({ lyrics, navigation, title='You Have Not Saved Any Lyrics Yet' }) => {
    if(!lyrics.length) {
        return <FInfo title={ title } />
    } else {
        return lyrics.map(lyrics => (
            <LyricsTile key={ lyrics.id } lyrics={ lyrics } navigation={ navigation } />
        ))
    }
};


const LyricsTile = ({ lyrics, navigation }) => {
    const handler = async () => {
        const { id } = lyrics;
        const saved = await isSongSaved(id);
        navigation.navigate('Lyrics', { song_id: id, saved: saved });
    };

    return (
        <TouchableOpacity style={ styles.tile } activeOpacity={ 0.7 } onPress={ () => handler() } >
            <View style={ layout.columnSeparator } >
                <View>
                    <Image source={{ uri: `${getApi()}/uploads/images/${lyrics.photo_name}`}}
                        style={{ height: 40, width: 40 }}
                    />
                </View>
    
                <View>
                    <Text style={ styles.title } numberOfLines={ 1 }>
                        { lyrics.title }
                    </Text>
                    <Text style={ styles.artiste } numberOfLines={ 1 }>
                        { lyrics.artiste }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    tile: {
        padding: 7,
        paddingTop: 10,
    },
    title: {
        paddingLeft: 5,
        fontWeight: 'bold',
        color: '#333333',
    },
    artiste: {
        paddingLeft: 7,
        color: colors.black,
    }
})
