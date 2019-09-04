import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FInfo } from '../../res/custom/FInfo';
import layout from '../../res/styles/layout';
import { FRoundImage } from '../../res/custom/FImages';
import { getApi } from '../../data/api';
import { colors } from '../../res/colors';


export const CommentsList = ({ comments }) => {
    if(comments.length) {
        return comments.map(comment => (
            <Comment key={ comment.id } comment={ comment } />
        ));
    } else {
        return (
            <FInfo title='No Comments' />
        );
    }
};

const Comment = ({ comment }) => (
    <View style={ styles.comment }>
        <View style={ layout.columnSeparator } >
            <View>
                <FRoundImage source={{ uri: `${getApi()}/uploads/profile/${comment.user.photo_name}` }} />
            </View>
            <View>
                <Text style={ styles.title } >{ comment.user.name }</Text>
            </View>
        </View>

        <View>
            <Text style={{ marginLeft: 5 }}>{ comment.body }</Text>
            <Text style={{ color: colors.black,  fontSize: 12, marginLeft: 5 }}>{ comment.timestamp }</Text>
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
    comment: {
        marginTop: 7,
        marginBottom: 7,
    },
})
