import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Content, Item, Form, Input, Label, Icon, Toast } from 'native-base'
import CardView from '../../layout/Card'
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { createApolloFetch } from 'apollo-fetch'
import Modal from "react-native-modal";
import IconTiny from 'react-native-vector-icons/Feather'
import { StackActions } from 'react-navigation';
import ListProject from '../../layout/ListItem';
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });

export default class AddClient extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            client: '',
            name: '',
            address: '',
            phone: '',
            email: '',
            data: [],
            dataBackup: [],
            detailData: [],
            projectId: '',
            showAlert: false,
            progress: false,
        }
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    componentDidMount() {
        let id = this.props.navigation.getParam('_id')
        var temp = []
        var data = []
        let name; let email; let phone; let address;
        temp = this.props.navigation.getParam('data')
        temp.forEach(function (item) {
            if (item.id === id) {
                name = item.name; email = item.email; address = item.address; phone = item.contact
                item.data.forEach(function (item_d) {
                    let progress = null
                    if (item_d.status === '0') { progress = 'Preparing' }
                    else if (item_d.status === '2') { progress = 'Closed' }
                    else if (item_d.status === '1') {
                        let counter = 0
                        item_d.module.forEach(function (module) {
                            let done = module.requirement.filter(function (search) { return search.status === '1' })
                            if (module.requirement.length === done.length) { counter++ }
                        })
                        progress = 'On Progress (' + Math.round(counter / item_d.module.length * 100) + '%)'
                    }
                    data.push({
                        code: '[' + item_d.code + '] ',
                        project: item_d.name,
                        progress: progress
                    })
                })

            }
        })
        this.setState({
            name: name,
            email: email,
            phone: phone,
            address: address,
            detailData: data,
            dataBackup: data
        })
    }
    async push() {

    }

    deleteClient() {
        const { detailData } = this.state
        if (detailData === null) {
            this.fetch({
                query: `
            mutation{
              client_delete(_id:"`+ this.props.navigation.getParam('_id') + `"){_id}
            }`
            })
        } else {
            this.setState({ showAlert: false })
            Toast.show({
                text: 'There are projects that are currently registered',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        }
    }

    updateClient(name, email, phone, address) {
        const { params } = this.props.navigation.state
        let id = this.props.navigation.getParam('_id')
        this.setState({
            name: name,
            email: email,
            phone: phone,
            address: address
        })
        params.update(id, name, email, phone, address)
    }
    list_body(...datas) {
        return (
            <View style={{ flexDirection: 'row', marginVertical: -10 }}>
                <Text style={{ width: 65 }}>{datas[0]['code']}</Text>
                <View style={{ paddingLeft: 10, alignItems: 'flex-start', }}>
                    <Text style={styles.titleProject} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>{datas[0]['project']}</Text>
                    <Text style={styles.status}>{datas[0]['progress']}</Text>
                </View>
            </View>
        )
    }
    list_project() {
        return (
            <View style={{ marginLeft: -5 }}>
                {this.state.detailData.map((datas, index) =>
                    <ListProject
                        key={index}
                        Body={this.list_body(datas)} />
                )}

            </View>
        )
    }
    header() {
        let data = []
        const { name, address, email, phone } = this.state
        data.push({
            name: name, address: address, email: email, phone: phone
        })
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                <View style={[styles.head, { marginTop: 8, justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <IconTiny name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                    </TouchableOpacity>
                    <Text style={[styles.font, { textAlign: 'center', marginLeft: 20, fontSize: 20 }]}>Detail Client</Text>
                    <View style={styles.head}>
                        <TouchableOpacity onPress={() => this.setState({ showAlert: true })}>
                            <IconTiny name='trash-2' style={{ fontSize: 20, color: 'red', marginRight: 10, marginTop: 5, opacity: 0.6 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.isi}>
                    <View style={[styles.head, { justifyContent: 'space-between' }]}>
                        <Text style={[styles.font, styles.title]} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>{this.state.name}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditClient', {
                            id: this.props.navigation.getParam('_id'),
                            update: this.updateClient.bind(this),
                            data: data,
                            uri: this.props.navigation.getParam('uri')
                        })}>
                            <IconTiny name='edit' style={{ fontSize: 20, color: 'white', marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.head, { justifyContent: 'space-between' }]}>
                        <View style={styles.head}>
                            <IconTiny name='mail' style={styles.icon} />
                            <Text style={[styles.font, styles.subtitle]}>{this.state.email}</Text>
                        </View>
                        <View style={styles.head}>
                            <IconTiny name='phone' style={styles.icon} />
                            <Text style={[styles.font, styles.subtitle]}>{this.state.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.head}>
                        <IconTiny name='map-pin' style={styles.icon} />
                        <Text style={[styles.font, styles.subtitle]}>{this.state.address}</Text>
                    </View>
                    {this.searchBar()}
                </View>
            </LinearGradient>
        )
    }
    _modalDelete() {
        const button = [{ color: '#f8f8f8', text: 'Cancel', fontColor: 'black' },
        { color: 'red', text: 'Delete', fontColor: 'white' }]
        const setModalVisible = (params) => {
            if (params === 'red') {
                this.deleteClient()
            } else {
                this.setState({ showAlert: false })
            }
        }
        return (
            <Modal
                isVisible={this.state.showAlert}
                onBackButtonPress={() => this.setState({ showAlert: false })}
                animationInTiming={600}
                animationOutTiming={600}
            >
                <View style={styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Delete</Text>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                        <Text>Are you sure want to delete this client?</Text>
                    </View>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270, marginBottom: 20 }} />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: 250 }}>
                        {button.map((datas, index) =>
                            <Button danger key={index} style={{ elevation: 1, marginBottom: 30, backgroundColor: datas.color, borderRadius: 4 }} onPress={() => setModalVisible(datas.color)}>
                                <Text style={{ color: datas.fontColor }}>{datas.text}</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>)
    }
    searchBar() {
        return (
            <Form style={styles.searchBar}>
                <Item floatingLabel>
                    <Label style={{ color: '#dfdfdf' }}>Search Project..</Label>
                    <Input
                        style={{ color: '#dfdfdf' }}
                        onChange={this.setSearchText.bind(this)}
                    />
                    <Icon name='search' type='Feather' style={{ fontSize: 20, color: '#dfdfdf' }} />
                </Item>
            </Form>
        )
    }
    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        var data = this.state.dataBackup;
        var searchText = searchText.trim().toLowerCase();
        data = data.filter(l => {
            return l.code.toLowerCase().match(searchText) || l.project.toLowerCase().match(searchText);
        });
        this.setState({
            detailData: data
        });
    }
    render() {
        
        return (
            <Content style={styles.card}  >
                {this.header()}
                <Text style={{ marginLeft: 20, fontSize: 12, color: 'grey', marginTop: 5 }}>Project</Text>
                {this._modalDelete()}
                {this.list_project()}

            </Content>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
    },
    Modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        height: 200,
        width: '80%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        marginTop: -80,
        marginLeft: 40,
        elevation: 1
    },
    header: {
        borderBottomLeftRadius: 40,
        //borderBottomRightRadius: 40,
        maxHeight: 200,
        height: 200
    },
    font: {
        color: 'white',
    },
    head: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    isi: {
        marginHorizontal: 55,
        marginTop: -5
    },
    subtitle: {
        fontSize: 12,
        color: '#dfdfdf',
        fontWeight: '100',
        marginLeft: 5
    },
    CircleShapeView: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        backgroundColor: '#ECECEC',
        opacity: 0.4,
        marginHorizontal: 8,

    },
    icon: {
        textAlign: 'left',
        fontSize: 12,
        marginTop: 3,
        color: '#dfdfdf'
    },
    searchBar: {
        marginTop: -16,
        marginLeft: -10,

    },
    titleProject: {
        fontSize: 16,
        alignSelf: 'auto',
        width: 300
    },
    status: {
        textAlign: 'left',
        fontSize: 12,
        color: 'grey',
        alignSelf: 'auto'
    }
})