import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../colors';


// Custom heading
export const FIcon = ({ source, iconStyles={} }) => (
    <Image
        style={ { ...icon.style, ...iconStyles } }
        source={ source }
    />
);


// Round image
export const FRoundImage = ({ source, roundStyles={} }) => (
    <Image
        style={ { ...round.style, ...roundStyles } }
        source={ source }
    />
);


// Image
export const FImage = ({ source, imageStyles={} }) => (
    <Image
        style={ { ...image.style, ...imageStyles } }
        source={ source }
    />
);


// Image
export const FImageClickable = ({ handler, source, imageStyles={} }) => (
    <TouchableOpacity
        onPress={ () => handler() }
    >
        <Image
            style={ { ...image.style, ...imageStyles } }
            source={ source }
        />
    </TouchableOpacity>
);


// Styles for icon
const icon = StyleSheet.create({
    style: {
        height: 30,
        width: 30,
        alignSelf: 'center',
        marginTop: 2,
        tintColor: colors.black,
        resizeMode: 'contain',
    },
});


// Styles for image
const image = StyleSheet.create({
    style: {
        width: '100%',
        height: 300,
        borderWidth: 1,
        borderColor: colors.mediumBlack,
        marginTop: 5,
    },
})


// Styles for image
const round = StyleSheet.create({
    style: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.mediumBlack,
        marginTop: 5,
    },
})
