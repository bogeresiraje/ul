import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../colors';


export const FImageCard = ({ source='', title='', subtitle='', handler }) => {
    return (
        <View style={ styles.container }>
            <TouchableOpacity activeOpacity={ 0.9 } onPress={ () => handler() } >
                <Image source={ source } style={ styles.imageStyles } />
            </TouchableOpacity>
            <Text style={ styles.title }
                numberOfLines={ 1 }
            >
                { title }
            </Text>
            <Text style={ styles.subtitle }
                numberOfLines={ 2 }
            >  
                { subtitle }
            </Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 220,
        padding: 7,
    },
    imageStyles: {
        width: '100%',
        height: 150,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333333',
    },
    subtitle: {
        textAlign: 'center',
        color: colors.black,
    },
})
