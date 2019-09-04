import React, { Component } from 'react';
import { ScrollView, View, ToastAndroid, RefreshControl } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { getUser, permissionsAllowed } from '../../../data/AccessControl';
import { getAccessUrl, getApi } from '../../../data/api';
import { FLoading } from '../FLoading';
import { FWrong } from '../FWrong';
import { FImageButton, FButton } from '../FButtons';
import { FImage } from '../FImages';
import FIndicator from '../FIndicator';
import { colors } from '../../colors';
import layout from '../../styles/layout';


export class FChangePhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            somethingWrong: false,
            activeIndicator: false,

            user: {},

            // Edit details
            picture: null,
        };
    }

    componentDidMount() {
        this._getUser();
    }

    _getUser = async () => {
        const email = await getUser();
        if(email) {
            this._submitProfileForm(email);

        } else {
            this.props.navigation.navigate('Login');
        }
    };

    // Submit post request to server
    _submitProfileForm = email => {
        const formData = new FormData();
        formData.append('email', email);
        const url = getAccessUrl() + '/get_user';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ loading: false, user: response.user });
                } else {
                    this.setState({ loading: false, somethingWrong: true });
                }
            },
            () => this.setState({ loading: false, somethingWrong: true })
        )
        .catch(() => this.setState({ loading: false, somethingWrong: true }) )
    };


    _refresh = async () => {
        this.setState({ refreshing: true });
        const email = await getUser();
        const formData = new FormData();
        formData.append('email', email);
        const url = getAccessUrl() + '/get_user';
        fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user) {
                    this.setState({ refreshing: false, user: response.user });
                } else {
                    this.setState({ refreshing: false, somethingWrong: true });
                }
            },
            () => this.setState({ refreshing: false, somethingWrong: true })
        )
        .catch(() => this.setState({ refreshing: false, somethingWrong: true }) )
    };

    // Take photo from camera
    _takePicture = async () => {
        const access = permissionsAllowed();
        if(access){
            // If permissions granted, open Camera
            ImagePicker.launchCamera({}, response => {
                if(response.didCancel){
                    // If cancelled, do nothing
                } else if(response.error){
                    // If error happened, do nothing
                } else{
                    // Save photo in state
                    this.setState({ picture: response });
                }
            })
        }
    };

    // Choose photo from gallery
    _choosePicture = async () => {
        const access = permissionsAllowed();
        if(access){
            // If permissions granted, open Image Library
            ImagePicker.launchImageLibrary({}, response => {
                if(response.didCancel){
                    // If caancelled, do nothing

                } else if(response.error){
                    // If error happened, do nothing

                } else{
                    // Save photo in state
                    this.setState({ picture: response });
                }
            })
        }
    };

    // Change Photo
    _submit = () => {
        this.setState({ activeIndicator: true });

        // values
        const { user, picture } = this.state;

        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('photo', {
            uri: picture.uri,
            type: picture.type,
            name: picture.fileName,
         });

         const url = getAccessUrl() + '/change_profile_photo';
         fetch(url, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(response => {
                if(response.user){
                    // Successfully Updated Profile Photo
                    this.setState({ activeIndicator: false, user: response.user, picture: null });
                    ToastAndroid.showWithGravity(
                        'Successfully Updated Profile Photo',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                    )
                } else {
                    // Something went wrong
                    this.setState({ activeIndicator: false, somethingWrong: true });
                }
            },
            () => this.setState({ activeIndicator: false, somethingWrong: true })
        )
        .catch(() => this.setState({ activeIndicator: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState({ somethingWrong: false });
    };

    render() {
        const { loading, refreshing, activeIndicator, somethingWrong, picture, user } = this.state;

        if(loading) {
            return <FLoading loadingColor={ colors.purple } />;

        } else if(somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />

        } else {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={ refreshing }
                            onRefresh={ this._refresh }
                        />
                    }
                >
                    <Display
                        user={ user }
                        picture={ picture }
                        choosePicture={ this._choosePicture }
                        takePicture={ this._takePicture }
                        activeIndicator={ activeIndicator }
                        submit={ this._submit }
                    />
                    <View style={ layout.padBottom }></View>
                </ScrollView>
            );
        }
    }
}


const Display = (props) => {
    const { user, activeIndicator, picture, choosePicture, takePicture, submit } = props;

    return (
        <View style={ layout.container }>
            <FlexPhoto user={ user } picture={ picture } />

            <FImageButton
                source={ require('../../icons/gallery.png') }
                title='Choose a Picture'
                onPress={ choosePicture }
                buttonStyles={ { width: '70%', borderRadius: 10 } }
                textStyles={ { textAlign: 'left' } }
            />

            <FImageButton
                source={ require('../../icons/camera.png') }
                title='Take a Picture'
                onPress={ takePicture }
                buttonStyles={ { width: '70%', borderRadius: 10 } }
                textStyles={ { textAlign: 'left' } }
            />

            <FlexButton activeIndicator={ activeIndicator } picture={ picture } submit={ submit } />
        </View>
    );
};

const FlexPhoto = ({ user, picture }) => {
    if(picture) {
        return (
            <FImage
                source={ picture }
            />
        );
    } else {
        return (
            <FImage
                source={{ uri: `${getApi()}/uploads/profile/${user.photo_name}` }}
            />
        );
    }
};


const FlexButton = ({ activeIndicator, picture, submit }) => {
    if(picture){
        if(activeIndicator){
            return (
                <FIndicator
                    vStyles={{ borderRadius: 10, width: '70%' }}
                    bColor={ colors.purple } color={ colors.white }
                />
            )
        }
        else {
            return (
                <FButton
                    handler={ submit }
                    buttonStyles={{ borderRadius: 10, backgroundColor: colors.purple, borderColor: colors.purple,
                        width: '70%' }}
                    textStyles={{ color: colors.white }}
                />
            );
        }

    } else {
        return null;
    }
};
