import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Text, CardItem, Content, Item, Input, Form, Label, Button, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import ListProject from '../../layout/ListItem';
import Modal from "react-native-modal";

export default class DetailEmployeeContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            isLeader: '',
            name: '',
            phone: '',
            email: '',
            division_name: '',
            isLeaderID: '',
            modalDelete: false,
            projectLength: null,
            invitation: null,
            modalReset: false
        }

    }
    // static getDerivedStateFromProps(props) {
    //     let data = []
    //     props.data.forEach(function(item_d){
    //       item_d.employee.forEach(function(item_e){ data.push(item_e) })
    //     })
    //     return {
    //       data:data
    //     }
    //   }
    componentDidMount() {
        this.push()
    }
    async push() {
        const retrievedItem = await AsyncStorage.getItem('leader');
        const item = JSON.parse(retrievedItem);
        this.setState({ isLeader: item })
        var id = this.props.navigation.getParam('_id')
        var temp = this.props.navigation.getParam('data')
        var leader_id = ''
        var data = []
        var name = ''
        var phone = ''
        var email = ''
        var division_name = ''
        var invitation = ''
        var projectLength = ''
        temp.forEach(function (item_d) {
            if (item_d.id === id) {
                name = item_d.name
                phone = item_d.contact
                division_name = item_d.division_name
                email = item_d.email
                leader_id = item_d.division_id
                projectLength = item_d.project
                invitation = item_d.invitation
                item_d.data.forEach(function (item) {
                    var progress = null
                    if (item.status === '0') { progress = 'Preparing' }
                    else if (item.status === '2') { progress = 'Closed' }
                    else if (item.status === '1') {
                        var counter = 0
                        item.module.forEach(function (module) {
                            var done = module.requirement.filter(function (search) { return search.status === '1' })
                            if (module.requirement.length === done.length) { counter++ }
                        })
                        progress = 'On Progress (' + Math.round(counter / item.module.length * 100) + '%)'
                    }

                    data.push({
                        project: item.name,
                        code: '[' + item.code + ']',
                        progress: progress,

                    })
                })
            }
        })
        //console.log(name)
        this.setState({
            data: data,
            dataBackup: data,
            name: name,
            division_name: division_name,
            phone: phone,
            email: email,
            isLeaderID: leader_id,
            invitation: invitation,
            projectLength: projectLength
        })
    }
    deleteEmployee() {
        const { params } = this.props.navigation.state
        const { projectLength, invitation } = this.state
        var id = this.props.navigation.getParam('_id')
        if (projectLength === 0 && invitation === 0) {
            params.delete(id)
            this.setState({ modalDelete: false })
            Toast.show({
                text: 'Successfully deleted',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'green' }
            })
            this.props.navigation.pop()
        } else {
            Toast.show({
                text: 'There are projects or invitations that are currently registered',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
            this.setState({ modalDelete: false })
        }
    }
    resetEmployee() {
        const { params } = this.props.navigation.state
        var id = this.props.navigation.getParam('_id')
        params.reset(id)
        Toast.show({
            text: 'Default Password is 1234',
            buttonText: 'Undo',
            duration: 3000,
            textStyle: { color: '#add8e6' }
        })
    }
    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        var data = this.state.dataBackup;
        var searchText = searchText.trim().toLowerCase();
        data = data.filter(l => {
            return l.code.toLowerCase().match(searchText) || l.project.toLowerCase().match(searchText);
        });
        this.setState({
            data: data
        });
    }
    _deleteModal() {
        const { modalDelete } = this.state
        const button = [{ backgroundColor: 'white', text: 'Cancel', color: 'black' },
        { backgroundColor: 'red', text: 'Delete', color: 'white' }]
        const setModalVisible = (params) => {
            if (params === 'red') {
                this.deleteEmployee()
                this.setState({ modalDelete: false })
            } else {
                this.setState({ modalDelete: false })
            }
        }
        return (
            <Modal
                isVisible={modalDelete}
                onBackButtonPress={() => this.setState({ modalDelete: false })}
                animationInTiming={600}
                animationOutTiming={300}>
                <View style={styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Delete Employee</Text>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                        <Text>Are you sure want to delete this Employee?</Text>
                    </View>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270, marginBottom: 10 }} />
                    <View style={styles.buttonContent}>
                        {button.map((val, index) =>
                            <Button key={index} style={[styles.button, { backgroundColor: val.backgroundColor }]}
                                onPress={() => setModalVisible(val.backgroundColor)}>
                                <Text style={{ color: val.color }}>{val.text}</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>
        )
    }
    _resetModal() {
        const { modalReset } = this.state
        const button = [{ backgroundColor: 'white', text: 'Cancel', color: 'black' },
        { backgroundColor: '#4c669f', text: 'Reset', color: 'white' }]
        const setModalVisible = (params) => {
            if (params === '#4c669f') {
                this.resetEmployee()
                this.setState({ modalReset: false })
            } else {
                this.setState({ modalReset: false })
            }
        }
        return (
            <Modal
                isVisible={modalReset}
                onBackButtonPress={() => this.setState({ modalReset: false })}
                animationInTiming={600}
                animationOutTiming={300}>
                <View style={styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Reset Password</Text>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                        <Text>This member's password will return to default</Text>
                    </View>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270, marginBottom: 10 }} />
                    <View style={styles.buttonContent}>
                        {button.map((val, index) =>
                            <Button key={index} style={[styles.button, { backgroundColor: val.backgroundColor }]}
                                onPress={() => setModalVisible(val.backgroundColor)}>
                                <Text style={{ color: val.color }}>{val.text}</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>
        )
    }
    _header() {
        const { name, division_name, phone, email } = this.state
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                <View style={[styles.head, { marginTop: 8, justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                    </TouchableOpacity>
                    <Text style={[styles.font, { textAlign: 'center', marginLeft: 20, fontSize: 20 }]}>Detail Employee</Text>
                    <View>
                        {this.state.isLeader === '1' &&
                            <View style={styles.head}>
                                <TouchableOpacity onPress={() => this.setState({ modalReset: true })}>
                                    <MaterialIcon name='lock-reset' style={{ fontSize: 25, color: 'white', marginTop: 5, marginRight: 10 }} />
                                </TouchableOpacity>
                                {this.state.isLeaderID !== 'leader' &&
                                    <TouchableOpacity onPress={() => this.setState({ modalDelete: true })}>
                                        <Icon name='trash-2' style={{ fontSize: 25, color: 'red', marginRight: 10, marginTop: 5, opacity: 0.6 }} />
                                    </TouchableOpacity>
                                }
                            </View>
                        }
                    </View>
                </View>
                <View style={styles.isi}>
                    <View style={[styles.head, { justifyContent: 'space-between' }]}>
                        <Text style={[styles.font, styles.title]} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>{name}</Text>
                    </View>
                    <View style={styles.head}>
                        <Icon name='mail' style={styles.icon} />
                        <Text style={[styles.font, styles.subtitle]}>{email}</Text>
                    </View>
                    <View style={styles.head}>
                        <Icon name='phone' style={styles.icon} />
                        <Text style={[styles.font, styles.subtitle]}>{phone}</Text>
                    </View>
                    <View style={styles.head}>
                        <Text style={[styles.font, styles.subtitle]}>Division:</Text>
                        <Text style={[styles.font, styles.subtitle]}>{division_name}</Text>
                    </View>
                </View>
                {this._searchBar()}
            </LinearGradient>
        )
    }
    _searchBar() {
        return (
            <Form style={styles.searchBar}>
                <Item floatingLabel>
                    <Label style={{ color: '#D3D3D3' }}>Search Project..</Label>
                    <Input
                        style={{ color: 'white' }}
                        onChange={this.setSearchText.bind(this)}
                    />
                    <Icon name='search' style={{ fontSize: 20, color: '#4c669f' }} />
                </Item>
            </Form>
        )
    }
    _listBody(...datas) {
        return (
            <View style={{ flexDirection: 'row', marginVertical: -13 }}>
                <Text style={{ width: 65 }}>{datas[0]['code']}</Text>
                <View style={{ paddingLeft: 10, alignItems: 'flex-start', }}>
                    <Text style={styles.titleProject} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>{datas[0]['project']}</Text>
                    <Text style={styles.status}>{datas[0]['progress']}</Text>
                </View>
            </View>
        )
    }
    _listProject() {
        const { data } = this.state
        return (
            <View style={{ marginLeft: -5 }}>
                {data.map((datas, index) =>
                    <ListProject
                        key={index}
                        Body={this._listBody(datas)} />
                )}
            </View>
        )
    }
    render() {
        return (
            <Content style={{ flex: 1 }}>
                {this._header()}
                <Text style={{ marginLeft: 20, fontSize: 12, color: 'grey', marginTop: 5 }}>Project</Text>
                {this._listProject()}
                {this._deleteModal()}
                {this._resetModal()}
            </Content>
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
    },
    header: {
        borderBottomLeftRadius: 40,
        //borderBottomRightRadius: 40,
        maxHeight: 200,
        height: 200
    },
    searchBar: {
        marginTop: -16,
        marginHorizontal: '8%',

    },
    head: {
        flexDirection: 'row',
    },
    subtitle: {
        fontSize: 12,
        color: '#dfdfdf',
        fontWeight: '100',
        marginLeft: 5
    },
    icon: {
        textAlign: 'left',
        fontSize: 12,
        marginTop: 3,
        color: '#dfdfdf'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    isi: {
        marginLeft: 60,
        marginTop: -5
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
    },
    buttonDel: {
        elevation: 1, marginBottom: 30, borderRadius: 4, backgroundColor: 'white'
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
        marginTop: 80,
        marginLeft: 40,
        elevation: 1

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
    buttonContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 270,
        marginTop: 10
    }
});