import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs, Button, Toast, } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import { StackActions } from 'react-navigation';
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });

export default class AddDivisionContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            divisionName: ''
        }
    }
    addDivision(name) {
        const { params } = this.props.navigation.state
        params.function(name)
        Toast.show({
            text: 'Division added',
            buttonText: 'Undo',
            duration: 3000,
            textStyle: { color: 'green' }
        })
        this.props.navigation.dispatch(StackActions.popToTop());

    }
    _content() {
        const { divisionName } = this.state
        const addDivisionValidation = () => {
            if (divisionName === '') {
                Toast.show({
                    text: 'Form cannot be empty',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'yellow' }
                })
            } else {
                this.addDivision(divisionName)
            }
        }
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ divisionName: text })}
                        value={divisionName} />
                </Item>
                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => addDivisionValidation()}>
                    <Text style={{ textAlign: 'center' }}>Add</Text>
                </Button>
            </Content>
        )
    }
    render() {
        const { params } = this.props.navigation.state
        return (
            <View style={{ flex: 1 }}>
                {params.header('Add Division')}
                {this._content()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    font: {
        color: 'white'
    },
    Input: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        borderRadius: 4,
        borderColor: '#E8E8E8'
    },
    Subtitle: {
        color: '#A9A9A9',
        marginTop: 30
    },
});