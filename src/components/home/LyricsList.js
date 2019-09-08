import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import text from '../../res/styles/text';
import { colors } from '../../res/colors';


export const LyricsList = ({ lyricsList, isSelected=f=>f, toggleSelected=f=>f }) => {
    if (lyricsList.length === 0) {
        return (
            <Text style={ text.autoText } >No Lyrics Available For This Song</Text>
        );
    } else {
        return lyricsList.map(lyrics => (
            <LyricsLine key={ lyrics.id } lyrics={ lyrics } isSelected={ isSelected } 
                toggleSelected={ toggleSelected }
            />
        ))
    }
};


const LyricsLine = ({ lyrics, toggleSelected }) => {
    if(lyrics.line) {
        if(lyrics.selected) {
            return (
                <TouchableOpacity
                    onPress={ () => toggleSelected(lyrics.id, lyrics.line, lyrics.selected) }
                >
                    <Text style={ styles.selectedLine } >
                        { lyrics.line }
                    </Text>
                </TouchableOpacity>
            );
        }
        else if (lyrics.num_edits) {
            return (
                <TouchableOpacity
                    onPress={ () => toggleSelected(lyrics.id, lyrics.line, lyrics.selected) }
                >
                    <Text style={ styles.editedLine } >
                        { lyrics.line }
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    onPress={ () => toggleSelected(lyrics.id, lyrics.line, lyrics.selected) }
                >
                    <Text style={ styles.nonSelectedLine } >
                        { lyrics.line }
                    </Text>
                </TouchableOpacity>
                
            );
        }

    } else {
        return (
            <React.Fragment>
                <Text style={ styles.nonSelectedLine} >
                    { lyrics.line }
                </Text>
            </React.Fragment>
        );
    }
};


const styles = StyleSheet.create({
    selectedLine: {
        padding: 7,
        textAlign: 'center',
        backgroundColor: 'gray',
    },
    nonSelectedLine: {
        textAlign: 'center',
        padding: 7,
    },
    editedLine: {
        padding: 7,
        textAlign: 'center',
        backgroundColor: '#dedee2',
    },
})
