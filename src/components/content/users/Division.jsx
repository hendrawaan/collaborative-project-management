import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs, Body } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import FAB from '../../layout/FAB'
import ListDivision from '../../layout/ListItem';
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });
const setting = [{ icon: 'edit-3', text: 'Edit Project' },
{ icon: 'play', text: 'Start Project' },
{ icon: 'trash', text: 'Delete Project' },
]
export default class DivisionContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: this.props.data,
            isLeader: ''
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        var data = []
        var temp = props.data
        temp.forEach(function (item_d) {
            data.push(item_d)
        })
        this.setState({ data: data })
    }
    componentDidMount() {
        this.push()
    }
    async push() {
        const retrievedItem = await AsyncStorage.getItem('leader');
        const item = JSON.parse(retrievedItem);
        /*var temp = this.props.data
        this.state.dataBackup.forEach(function (item_d) {
            item_d.employee.forEach(function (item_e) {
                data.push(item_e)
            })
        })*/
        this.setState({ isLeader: item })
    }
    _listBody(...datas) {
        return (
            <Body style={{ marginLeft: 20, marginVertical: -10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailDivision', {
                    _id: datas[0]['id'],
                    data: this.state.data,
                    update: this.props.update.bind(this),
                    delete: this.props.delete.bind(this)
                })}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'grey', fontSize: 14 }}>{datas[0]['member']}</Text>
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text ellipsizeMode='tail' maxLength={20} numberOfLines={1} style={{ width: 200 }}>{datas[0]['name']}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Body>
        )
    }
    _listRight(id) {
        return (
            <Right>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailDivision', {
                    _id: id,
                    data: this.state.data,
                    update: this.props.update.bind(this),
                    delete: this.props.delete.bind(this)
                })}>
                    <Icon name='chevron-right' style={{ fontSize: 25, marginRight: 10, color: 'grey' }} />
                </TouchableOpacity>
            </Right>
        )
    }
    _listDivision() {
        const { data } = this.state
        return (
            <View style={{ marginLeft: -10, paddingVertical: -20 }} >
                {data.map((datas, key) =>
                    <ListDivision
                        key={key}
                        Body={this._listBody(datas)}
                        Right={this._listRight(datas.id)}
                    />
                )}
            </View>
        )
    }
    render() {
       
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginLeft: 20, fontSize: 12, color: 'grey', marginTop: 5 }}>Employee</Text>
                {this._listDivision()}
                
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