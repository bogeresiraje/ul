
import AsyncStorage from '@react-native-community/async-storage';



export const getSavedLyrics = async () => {
    const savedLyrics = await AsyncStorage.getItem('savedLyrics');
    if(savedLyrics !== null) {
        return JSON.parse(savedLyrics);
    } else {
        return [];
    }
};


export const saveLyrics = async lyrics => {
    const savedLyrics = await getSavedLyrics();
    const newList = [lyrics, ...savedLyrics]
    await AsyncStorage.setItem('savedLyrics', JSON.stringify(newList));
    return getSavedSong(lyrics.id);
};

export const getSavedSong = async song_id => {
    const savedLyrics = await getSavedLyrics();
    for(let i = 0; i < savedLyrics.length; i++) {
        if(savedLyrics[i].id === song_id) {
            return savedLyrics[i];
        }
    }
};

export const isSongSaved = async song_id => {
    const savedLyrics = await getSavedLyrics();
    for(let i = 0; i < savedLyrics.length; i++) {
        if(savedLyrics[i].id === song_id) {
            return true;
        }
    }
    return false;
    
};


export const deleteSong = async song_id => {
    const savedList = await getSavedLyrics();
    const newList = savedList.filter(song => song.id !== song_id);
    await AsyncStorage.setItem('savedLyrics', JSON.stringify(newList));
};
