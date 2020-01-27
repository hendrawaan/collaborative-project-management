import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import ClientContent from '../../components/content/client/AddClient'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather'
import DetailClient from '../../components/content/client/DetailClient';
export default class DetailClientScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }
    render() {
        return (
            <DetailClient
                navigation={this.props.navigation}
            />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    mainScreen: {
        flex: 1,
        backgroundColor: '#0881a3',
    },
    upperScreen: {
        maxHeight: 50,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#000',
        shadowRadius: 2,
        borderColor: '#ddd',
        borderRadius: 2,
        flexDirection: 'row',
    },
    title: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    },
    font: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',

    },
    form: {
        flex: 1,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    }
});
