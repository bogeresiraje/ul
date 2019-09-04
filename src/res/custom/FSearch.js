import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { FWrong } from './FWrong';
import input from '../styles/input';
import { LyricsList } from '../../components/saved/Saved';
import layout from '../styles/layout';
import { getApi } from '../../data/api';
import { FLoading } from './FLoading';


export class FSearch extends Component {
    static navigationOptions = ({ navigation }) => {
        const submitSearch = navigation.getParam('submitSearch');
        const handleSearch = navigation.getParam('handleSearch');

        return ({
            headerTitle: <TextInput style={ input.inputSearch } autoFocus placeholder='search'
                    returnKeyType='search' onChangeText={ text => handleSearch(text) }
                    enablesReturnKeyAutomatically={ true } autoCapitalize='none'
                    onSubmitEditing={ () => submitSearch() }
                />
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            somethingWrong: false,
            searching: false,
            text: '',
            searchResults: [],
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSearch: this._handleSearch,
                submitSearch: this._search
            })
    }

    _handleSearch = text => {
        this.setState({ text: text });
    };

    _search = () => {
        this.setState({ searching: true });
        const formData = new FormData();
        formData.append('search_key', this.state.text)
        // submit
        const url = getApi() + '/search_songs';
        fetch(url, { method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {
                if(data.songs) {
                    this.setState({ searchResults: data.songs, searching: false });
                } else {
                    this.setState({ somethingWrong: true, searching: false });
                }
            })
            .catch(() => this.setState({ searching: false, somethingWrong: true }) )
    };

    _tryAgain = () => {
        this.setState
        this._search();
    };

    render() {
        const { somethingWrong, searching, searchResults } = this.state;

        if(somethingWrong) {
            return <FWrong tryAgain={ this._tryAgain } />;

        } else if (searching) {
            return <FLoading title='Searching' />;

        } else {
            return (
                <ScrollView style={ layout.container }>
                    <LyricsList lyrics={ searchResults } title='No Available Results'
                        navigation={ this.props.navigation }
                    />
                    <View style={ layout.padBottom } ></View>
                </ScrollView>
            );
        }
    }
}
