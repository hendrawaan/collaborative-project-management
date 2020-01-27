import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs, Body } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import FAB from '../../layout/FAB'
import ListEmployee from '../../layout/ListItem';
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });
const setting = [{ icon: 'edit-3', text: 'Edit Project' },
{ icon: 'play', text: 'Start Project' },
{ icon: 'trash', text: 'Delete Project' },
]
const listFab = [{
    'key': '1',
    "title": "Add Employee",
    "icon": "plus",
    'action': 'AddEmployee'
}]
export default class EmployeeContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            isLeader: '',
            detail_id: '',
            detail_header: '',
            detail_division: '',
            detail_division_default: '',
            detail_leader: false
        }

    }
    UNSAFE_componentWillReceiveProps(props) {
        var data = []
        var temp = props.data
        temp.forEach(function (item_d) {
            item_d.employee.forEach(function (item_e) {
                data.push(item_e)
            })
        })
        this.setState({ data: data, dataBackup: data })
    }
    componentDidMount() {
        this.push()
    }

    async push() {
        const retrievedItem = await AsyncStorage.getItem('leader');
        const item = JSON.parse(retrievedItem);
        var data = []
        var temp = this.props.data
        temp.forEach(function (item_d) {
            item_d.employee.forEach(function (item_e) {
                data.push(item_e)
            })
        })
        this.setState({ data: data, dataBackup: data })
        this.setState({ isLeader: item })
    }
    list_handler(id) {
        var data = this.state.data.filter(function (item) { return item.id === id })
        var leader = null
        if (data[0]['division_id'] === this.props.leader) { leader = true }
        else { leader = false }
        this.setState({
            detail_id: data[0]['id'],
            detail_header: data[0]['name'],
            detail_division: data[0]['division_id'],
            detail_division_default: data[0]['division_id'],
            detail_leader: leader
        })
        this.props.navigation.navigate('DetailEmployee', { id: id, })
    }
    _listBody(...datas) {
        return (
            <Body style={{ marginLeft: 20, marginVertical: -10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailEmployee', {
                    _id: datas[0]['id'],
                    data: this.state.data,
                    delete: this.props.delete.bind(this),
                    update: this.props.update.bind(this),
                    reset: this.props.reset.bind(this)
                })}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'grey', fontSize: 14, marginTop: 10 }}>{datas[0]['project']}</Text>
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text ellipsizeMode='tail' maxLength={20} numberOfLines={1} style={{ width: 200 }}>{datas[0]['name']}</Text>
                            <Text note ellipsizeMode='tail' numberOfLines={1} style={{ width: 200 }}>{datas[0]['division_name']}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Body>
        )
    }
    _listRight(id) {
        return (
            <Right>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailEmployee', {
                    _id: id,
                    data: this.state.data,
                    delete: this.props.delete.bind(this),
                    update: this.props.update.bind(this),
                    reset: this.props.reset.bind(this)
                })}>
                    <Icon name='chevron-right' style={{ fontSize: 25, marginRight: 10, color: 'grey' }} />
                </TouchableOpacity>
            </Right>
        )
    }
    _listEmployee() {
        const { data } = this.state
        return (
            <View style={{ marginLeft: -10, paddingVertical: -20 }} onPress={() => this.props.navigation.goBack(null)}>
                {data.map((datas, key) =>
                    <ListEmployee
                        key={key}
                        Body={this._listBody(datas)}
                        Right={this._listRight(datas.id)}
                    />
                )}
            </View>
        )
    }
    render() {
        console.log(this.state.data)
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginLeft: 20, fontSize: 12, color: 'grey', marginTop: 5 }}>Project</Text>
                {this._listEmployee()}

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