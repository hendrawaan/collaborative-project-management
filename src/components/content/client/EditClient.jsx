import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, CardItem, Content, Item, Input, Toast, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });
const setting = [{ icon: 'edit-3', text: 'Edit Project' },
{ icon: 'play', text: 'Start Project' },
{ icon: 'trash', text: 'Delete Project' },
]
export default class EditClientContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            name: '',
            address: '',
            email: '',
            phone: '',
            valName: '',
            valAddress: '',
            valEmail: '',
            valPhone: ''
        }
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    componentDidMount() {
       
        let temp = this.props.navigation.getParam('data')
        let name; let address; let email; let phone;
        temp.forEach(function (item) {
            name = item.name; address = item.address; email = item.email; phone = item.phone;
        })
        this.setState({
            name: name, address: address, email: email, phone: phone
        })
    }
    editClient() {
        const { name, address, email, phone } = this.state
        const { params } = this.props.navigation.state
        let id = this.props.navigation.getParam('id')
        if (name === '' || address === ' ' || email === '' || phone === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        } else {
            this.fetch({
                query: `
            mutation{
              client_edit(
                _id:"`+ id + `",
                name:"`+ name + `",
                email:"`+ email + `",
                contact:"`+ phone + `",
                address:"`+ address + `"
              ){_id}
            }`
            })
            params.update(name, email, phone, address)
        }
    }
    _header(Title) {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={[styles.mainScreen, styles.upperScreen]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                    <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, marginTop: 6, fontWeight: 'bold' }]} />
                </TouchableOpacity>
                <Text style={styles.title}>{Title}</Text>
            </LinearGradient>
        )
    }
    _content() {
        return (
            <View style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.name}
                        status={this.state.valName}
                        onChangeText={(text) => this.setState({ name: text, valName: '' })}
                    />
                </Item>
                <Text style={styles.Subtitle}>Address</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.address}
                        status={this.state.valAddress}
                        onChangeText={(text) => this.setState({ address: text, valAddress: '' })}
                    />
                </Item>
                <Text style={styles.Subtitle}>Email</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.email}
                        status={this.state.valEmail}
                        onChangeText={(text) => this.setState({ email: text, valEmail: '' })}
                    />
                </Item>
                <Text style={styles.Subtitle}>Phone</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.phone}
                        status={this.state.valPhone}
                        onChangeText={(text) => this.setState({ phone: text, valPhone: '' })}
                    />
                </Item>
                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => this.editClient()}>
                    <Text style={{ textAlign: 'center' }}>Save</Text>
                </Button>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._header('Edit Client')}
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
        marginTop: 10
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
        height: 50
    },
    title: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    }
});