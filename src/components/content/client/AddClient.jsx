import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Content, Input, Item, Toast } from 'native-base'
import CardView from '../../layout/Card'
import AsyncStorage from '@react-native-community/async-storage';
//import { Input } from 'react-native-ui-kitten';
import { createApolloFetch } from 'apollo-fetch'
export default class AddClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            address: '',
            email: '',
            phone: '',
            valName: '',
            valAddress: '',
            valEmail: '',
            valPhone: '',
            organization: '',
            data: [],
        }
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }
    componentDidMount() {

    }
    validation() {
        if (this.state.name === '') {
            this.setState({ valName: 'danger' })
        } else if (this.state.email === '') {
            this.setState({ valAddress: 'danger' })
        } else if (this.state.phone === '') {
            this.setState({ valEmail: 'danger' })
        } else if (this.state.address === '') {
            this.setState({ valPhone: 'danger' })
        } else {
            return true
        }
    }
    async addClient() {
        const retrievedItem = await AsyncStorage.getItem('organization');
        const item = JSON.parse(retrievedItem);
        const { name, email, phone, address, organization } = this.state
        this.setState({
            organization: item
        })
        const { params } = this.props.navigation.state
        var _id = this.randomString(32, 'aA');
        if (this.validation() === true) {
            this.fetch({
                query: `
            mutation { 
              client_add(
                _id:"`+ _id + `",
                organization:"`+ organization + `",
                name:"`+ name + `",
                email:"`+ email + `",
                contact:"`+ phone + `",
                address:"`+ address + `"
              ){_id}
            }`
            })
            params.update(_id, name, email, phone, address)
            this.props.navigation.pop();
        } else {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        }
    }

    card_body() {
        return (
            <View style={styles.form}>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.name}
                        status={this.state.valName}
                        //caption={this.validation() ? '' : 'Invalid value'}
                        autoCapitalize="words"
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
                        label='Email'
                        size='small'
                        style={styles.st_inputfnt}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text, valEmail: '' })}
                        autoCapitalize='none'
                        status={this.state.valEmail}
                        keyboardType='email-address'
                    />
                </Item>
                <Text style={styles.Subtitle}>Phone Number</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={styles.st_inputfnt}
                        value={this.state.phone}
                        status={this.state.valPhone}
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ phone: text, valPhone: '' })}
                    />
                </Item>
                <Button block info style={styles.footerBottom} onPress={() => this.addClient()}>
                    <Text>Add Client</Text>
                </Button>
            </View>
        )
    }
    render() {
        return (
            <Content style={styles.card} behavior='padding' >
                <CardView
                    body={this.card_body()}
                />
            </Content>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        flex: 1,

    },
    st_inputfnt: {
        color: 'grey',
        marginTop: 5,

    },
    form: {
        paddingLeft: 20,
        paddingRight: 30,
        backgroundColor: 'transparent',
        marginVertical: 30,

    },
    footerBottom: {
        marginTop: 26,
        paddingTop: 10,
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: '#4c669f'
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
})