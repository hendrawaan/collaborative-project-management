import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import AddRequirementContent from '../../components/content/project/AddRequirement'
export default class AddRequirementScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AddRequirementContent navigation={this.props.navigation} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    font: {
        color: 'white'
    },
    header: {
        flex: 1,
        resizeMode: 'cover',

    },
    CardMenu: {
        borderRadius: 4,
        height: 90
    },
    MenuIcon: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '100'
    },
    CardTab: {
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        flex: 1,
        backgroundColor: 'white',
        marginTop: 40
    }
});