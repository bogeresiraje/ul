import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export const login = async user => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
};


export const isLoggedIn = async () => {
    const user = await AsyncStorage.getItem('user');
    if(user === null) {
        return false;
    } else {
        return true;
    }
};

export const logoutUser = async () => {
    await AsyncStorage.removeItem('user');
};

export const getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
};

// Check whether the user has allowed camera, and storage persmissions,
    // otherwise, prompt to allow
    export const permissionsAllowed = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA
                ]
            );
            if(granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && 
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && 
            granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch(error) {
            return false;
        }
    };
