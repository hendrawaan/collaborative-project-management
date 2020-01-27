import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Toast, Content, Item, Input, Badge, Tab, Tabs, Form, Textarea, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'

export default class AddModuleContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataBackup: [],
            moduleName: '',
            detailModule: ''
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

    insert_replace(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '\\n')
    }

    _content() {
        const { moduleName, detailModule } = this.state
        const { params } = this.props.navigation.state
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ moduleName: text })}
                        value={moduleName} />
                </Item>
                <Text style={styles.Subtitle}>Detail</Text>
                <Form style={[styles.Input, { height: 200 }]} regular >
                    <Content>
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ detailModule: text })}
                            value={detailModule}
                            multiline={true} />
                    </Content>
                </Form>

                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => params.function(moduleName, detailModule)}>
                    <Text style={{ textAlign: 'center' }}>Add</Text>
                </Button>
            </Content>
        )
    }
    render() {
        const { params } = this.props.navigation.state
        return (
            <View style={{ flex: 1 }}>
                {params.header("Add Module")}
                {this._content()}
                <Text></Text>
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