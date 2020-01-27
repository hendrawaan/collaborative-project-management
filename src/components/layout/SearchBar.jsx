import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SearchBar } from 'react-native-elements';
export default class searchbar extends React.Component {
    state = {
        search: '',
    };

    updateSearch = search => {
        this.setState({ search });
    };
    render() {
        const { search } = this.state;

        return (
            <View>
                <SearchBar
                    lightTheme
                    ref={search => this.search = search}
                    inputStyle={{ maxHeight: 30, fontSize: 12 }}
                    placeholder={this.props.placeholder}
                    containerStyle={this.props.style}
                    inputContainerStyle={{ backgroundColor: '#F2F3F4', height: 35 }}
                    onChangeText={this.updateSearch}
                    value={search}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Header: {
        backgroundColor: 'white',
    }
});