import { StyleSheet } from 'react-native';
import { colors } from '../colors';


export default input = StyleSheet.create({

    inputPicker: {
        height: 50,
        width: 100,
        color: '#555',
        paddingTop: 20,
        paddingBottom: 5,
        textAlign: 'center',
    },

    inputText: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        backgroundColor: colors.white,
        borderColor: '#aaa',
        textAlign: 'center',
        color: colors.black,
        marginBottom: 10,
    },

    inputSearch: {
        height: 40,
        width: '100%',
        backgroundColor: colors.white,
        color: '#333',
    },

    inputTextArea: {
        height: 100,
        width: '100%',
        backgroundColor: colors.white,
        borderWidth: 0.8,
        borderColor: colors.mediumBlack,
    },
})
