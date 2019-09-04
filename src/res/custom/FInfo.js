import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import text from '../styles/text';


export const FInfo = ({ title='No Available Data', subTitle="" }) => {

    return (
        <View style={ {...loadStyle.style } }>
            <Text style={ { ...text.autoText }}>{ title }</Text>
            <Text style={ { ...text.autoText }}>{ subTitle }</Text>
        </View>
    );
}


const loadStyle = StyleSheet.create({
    style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
})