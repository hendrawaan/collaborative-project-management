import React from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { Content, Item, Form, Thumbnail, Label, Button, Text, Input, List, ListItem, Body, Left, Right } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import Icon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient';
import ListClient from '../../layout/ListItem';
import CardClient from '../../layout/Card';

export default class ClientContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            organization: '',
            data: [],
            dataBackup: []
        }
        this.push();

    }
    UNSAFE_componentWillUnmount() {
        this.setState({
            data: [],
            organization: '',
            dataBackup: []
        })
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    async setItem() {
        const retrievedItem = await AsyncStorage.getItem('organization');
        const item = JSON.parse(retrievedItem);
        this.setState({
            organization: item
        })
        return item
    }
    async push() {
        const retrievedItem = await AsyncStorage.getItem('organization');
        const item = JSON.parse(retrievedItem);
        this.setState({
            organization: item,
            data: [],
            dataBackup: []
        })
        this.fetch({
            query: `{
            organization(_id:"`+ this.state.organization + `") {
              client {
                _id, name, email, contact, address,
                project { code, name, status,
                  module { requirement { status } }
                }
              }
            }
          }`}).then(response => {
                var data = []
                if (response.data.organization !== null) {
                    var temp = response.data.organization.client
                    temp.forEach(function (item) {
                        data.push({
                            id: item._id,
                            name: item.name,
                            email: item.email,
                            contact: item.contact,
                            address: item.address,
                            project: item.project.length,
                            data: item.project
                        })
                    })
                    this.setState({
                        data: data,
                        dataBackup: data
                    })
                }
            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            });
    }
    updateClient(id, name, email, contact, address) {
        let temp = this.state.data
        temp.forEach(function (item) {
            if (item.id === id) {
                item.id = item.id
                item.name = name
                item.email = email
                item.contact = contact
                item.address = address
            }
        })
        this.setState({
            data: temp,
            dataBackup: temp
        })
        this.props.navigation.pop()
    }
    addClient(id, name, email, contact, address) {
        this.setState({
            data: [...this.state.data, {
                id: id,
                name: name,
                email: email,
                contact: contact,
                address: address,
                project: 0,
                data: []
            }]
        })

    }
    searchBar() {
        return (
            <View style={styles.searchPosition}>
                <Item rounded style={styles.itemSearch}>
                    <Input
                        placeholder='Search Client..'
                        style={styles.searchBar}
                        placeholderTextColor='grey'
                        onChange={this.setSearchText.bind(this)}
                    />
                    <Icon name='search' style={{ fontSize: 25, marginRight: 18, color: 'grey' }} />
                </Item>
            </View>
        )
    }
    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        var data = this.state.dataBackup;
        var searchText = searchText.trim().toLowerCase();
        data = data.filter(l => {
            return l.name.toLowerCase().match(searchText) || l.address.toLowerCase().match(searchText);
        });
        this.setState({
            data: data
        });
    }

    list_body(...datas) {
        return (
            <Body style={{ marginLeft: 20, marginVertical: -10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailClient', {
                    _id: datas[0]['id'],
                    uri: this.props.navigation.getParam('uri'),
                    data: this.state.data,
                    update: this.updateClient.bind(this)
                })}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'grey', fontSize: 14, marginTop: 10 }}>{datas[0]['project']}</Text>
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text ellipsizeMode='tail' maxLength={20} numberOfLines={1} style={{ width: 200 }}>{datas[0]['name']}</Text>
                            <Text note ellipsizeMode='tail' numberOfLines={1} style={{ width: 200 }}>{datas[0]['address']}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Body>
        )
    }
    list_right(id) {
        return (
            <Right>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailClient', {
                    _id: id,
                    uri: this.props.navigation.getParam('uri'),
                    data: this.state.data,
                    update: this.updateClient.bind(this)
                })}>
                    <Icon name='chevron-right' style={{ fontSize: 25, marginRight: 10, color: 'grey' }} />
                </TouchableOpacity>
            </Right>
        )
    }
    list_client() {
        const { data } = this.state;
        return (
            <View style={{ marginLeft: -10, paddingVertical: -20 }} onPress={() => this.props.navigation.goBack(null)}>
                {data.map((datas, key) =>
                    < ListClient
                        key={key}
                        Body={this.list_body(datas)}
                        Right={this.list_right(datas.id)}
                    />
                )}
            </View>
        )
    }
    _header() {
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={[styles.mainScreen, styles.upperScreen]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                    <View style={styles.CircleShapeView}>
                        <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 30, elevation: 1, marginTop: 1, fontWeight: 'bold' }]} />
                    </View>
                </TouchableOpacity>
                <Text style={[styles.font, { marginVertical: 30 }]}>Client</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AddClient', {
                        uri: this.props.navigation.getParam('uri'),
                        update: this.addClient.bind(this)
                    })}>
                        <View style={styles.CircleShapeView}>
                            <Icon name='user-plus' style={[styles.font, { textAlign: 'center', fontSize: 25, marginTop: 4, opacity: 1, marginLeft: 5 }]} />
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        )
    }
    render() {

        return (
            <Content style={styles.container}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={this.state.hide}
                    backgroundColor="#4c669f"
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                {this._header()}

                <View style={[styles.mainScreen, { backgroundColor: 'white' }]}>
                    <Content style={styles.content}>
                        {this.searchBar()}
                        <Text style={{ marginLeft: 20, fontSize: 12, color: 'grey', marginTop: 5 }}>Project</Text>
                        {this.list_client()}
                    </Content>
                </View>
            </Content>
        )
    }
}
const styles = StyleSheet.create({
    content: {
        marginTop: -30,
        flex: 1
    },
    searchPosition: {
        marginHorizontal: 25,
    },
    searchBar: {
        width: 200,
        marginLeft: 10,
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    itemSearch: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f8f8f8',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    mainScreen: {
        flex: 1,
        backgroundColor: '#0881a3',
    },
    upperScreen: {
        maxHeight: 120,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#000',
        shadowRadius: 2,
        borderColor: '#ddd',
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    },
    bgimage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '50%',
    },
    CircleShapeView: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        backgroundColor: '#ECECEC',
        marginTop: 20,
        opacity: 0.4,
        marginHorizontal: 10,

    },
})