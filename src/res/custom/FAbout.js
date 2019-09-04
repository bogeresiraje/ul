import React, { Component } from 'react';
import {ScrollView, View, Linking, Text } from 'react-native';
import { FHeading } from './FText';
import { FContact } from './FContact';
import layout from '../styles/layout';
import { colors } from '../colors';


export class FAbout extends Component {

    _openEmail = () => {
        const url = 'mailto:ulyrics2019@gmail.com';
        Linking.canOpenURL(url)
            .then(supported => {
                if(supported){
                    return Linking.openURL(url);
                } else {
                    // To do
                }
            })
            .catch((err) => {
                // To do
            } )
    };

    _openPhone = () => {
        const url = 'tel:+256779222337';
        Linking.canOpenURL(url)
            .then(supported => {
                if(supported){
                    return Linking.openURL(url);
                } else {
                    // To do
                }
            })
            .catch((err) => {
                // To do
            }
        )
    };

    render() {
        return (
            <ScrollView>
                <View style={{ ...layout.container, padding: 15 }}>
                    <Text style={{ color: colors.black }}>
                        <Text style={{ fontWeight: 'bold', color: '#333' }}>ULyrics </Text>
                        is a Mobile Application that provides full access to lyrics of Ugandan music of all genres.
                    </Text>

                    <View style={ { ...layout.columnSeparator, marginTop: 20 } } >
                        <View>
                            <Text style={{ fontWeight: 'bold', color: '#333' }}>Version:</Text>
                        </View>
                        <View>
                            <Text style={{ marginLeft: 10, color: colors.black }}>1.0</Text>
                        </View>
                    </View>

                    <View style={ layout.columnSeparator } >
                        <View>
                            <Text style={{ fontWeight: 'bold', color: '#333' }} >Release Build:</Text>
                        </View>
                        <View>
                            <Text style={{ marginLeft: 10, color: colors.black }} >Beta</Text>
                        </View>
                    </View>

                    <FHeading title='Feel Free to Contact Us'
                        headStyles={{ fontSize: 20, textAlign: 'left' }}
                    />

                    <FContact title='Email' open={ this._openEmail } contact='ulyrics2019@gmail.com' />
                    <FContact title='Phone' open={ this._openPhone } contact='+256 779222337' />
                </View>
            </ScrollView>
        )
    }
}
