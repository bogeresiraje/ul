import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FInfo } from '../../res/custom/FInfo';
import layout from '../../res/styles/layout';
import { FRoundImage } from '../../res/custom/FImages';
import { getApi } from '../../data/api';
import { colors } from '../../res/colors';


export const EditList = ({ edits }) => {
    if(edits.length) {
        return edits.map(edit => (
            <Edit key={ edit.id } edit={ edit } />
        ));
    } else {
        return (
            <FInfo title='Line Has Not Been Edited Before' />
        );
    }
};

const Edit = ({ edit }) => (
    <View style={ styles.edit }>
        <View style={ layout.columnSeparator } >
            <View>
                <FRoundImage source={{ uri: `${getApi()}/uploads/profile/${edit.user.photo_name}` }} />
            </View>
            <View>
                <Text style={ styles.title } >{ edit.user.name }</Text>
            </View>
            <View>
                <Text style={ styles.status }>
                    { edit.status === 'pending' ? ' pending ' : ' accepted ' }
                </Text>
            </View>
        </View>

        <View>
            <Text style={{ marginLeft: 5 }}>{ edit.line }</Text>
            <Text style={{ color: colors.black,  fontSize: 12, marginLeft: 5 }}>{ edit.timestamp }</Text>
        </View>
    </View>
);


const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        color: '#333',
        padding: 7,
        paddingTop: 10,
    },
    edit: {
        marginTop: 7,
        marginBottom: 7,
    },
    status: {
        color: colors.black,
        margin: 7,
        textAlign: 'right',
        marginTop: 10,
        padding: 3,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 5,
    }
})
