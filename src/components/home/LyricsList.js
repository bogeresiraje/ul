import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import text from '../../res/styles/text';


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
        return (
            <TouchableOpacity
                onPress={ () => toggleSelected(lyrics.id, lyrics.line, lyrics.selected) }
            >
                <Text style={ lyrics.selected ? styles.selectedLine : styles.nonSelectedLine } >
                    { lyrics.line }
                </Text>
            </TouchableOpacity>
        );
    } else {
        if(lyrics.selected) {
            return (
                <Text style={ styles.selectedLine } >
                    { lyrics.line }
                </Text>
            );
        } else if (lyrics.num_edits) {
            return (
                <Text style={ styles.editedLine } >
                    { lyrics.line }
                </Text>
            );
        } else if(lyrics.num_comments) {
            return (
                <Text style={ styles.commentedLine } >
                    { lyrics.line }
                </Text>
            );
        } else {
            return (
                <Text style={ styles.nonSelectedLine } >
                    { lyrics.line }
                </Text>
            );
        }
    }
};


const styles = StyleSheet.create({
    selectedLine: {
        padding: 7,
        textAlign: 'center',
        backgroundColor: 'grey',
    },
    nonSelectedLine: {
        textAlign: 'center',
        padding: 7,
    },
    editedLine: {
        padding: 7,
        textAlign: 'center',
        backgroundColor: '#e3dcf2',
    },
    commentedLine: {
        padding: 7,
        textAlign: 'center',
        backgroundColor: '#b396f2',
    },
})
