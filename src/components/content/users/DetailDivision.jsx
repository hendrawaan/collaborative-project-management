import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs, Form, Label, Button, Toast, } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import ListEmployee from '../../layout/ListItem';
import Modal from "react-native-modal";
export default class DetailDivisionContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            isLeader: '',
            isLeaderID: '',
            divisionChange: '',
            employeeLength: '',
            modalDelete: false,
            modalEdit: false
        }
        this.push()
    }
    async push() {
        const retrievedItem = await AsyncStorage.getItem('leader');
        const item = JSON.parse(retrievedItem);
        this.setState({ isLeader: item })
        var id = this.props.navigation.getParam('_id')
        var temp = this.props.navigation.getParam('data')
        var data = []
        var leader_id = ''
        var lengthEmployee = ''
        var division_name = ''
        temp.forEach(function (item_d) {
            if (item_d.id === id) {
                lengthEmployee = item_d.employee.length
                division_name = item_d.name
                item_d.employee.forEach(function (item_e) {
                    leader_id = item_e.division_id
                    data.push({
                        phone: item_e.contact,
                        name: item_e.name,
                        email: item_e.email,
                        project: item_e.project
                    })
                })
            }
        })

        this.setState({ data: data, dataBackup: data, isLeaderID: leader_id, employeeLength: lengthEmployee, divisionChange: division_name })
    }
    deleteDivision() {
        const { params } = this.props.navigation.state
        var id = this.props.navigation.getParam('_id')
        if (this.state.employeeLength === 0) {
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
                text: 'There are members who are currently registered',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
            this.setState({ modalDelete: false })
        }
    }

    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        var data = this.state.dataBackup;
        var searchText = searchText.trim().toLowerCase();
        data = data.filter(l => {
            return l.name.toLowerCase().match(searchText) || l.email.toLowerCase().match(searchText);
        });
        this.setState({
            data: data
        });
    }
    _header() {
        const { name, division_name, phone, email } = this.state
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                <View style={{ marginTop: 8, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                    </TouchableOpacity>
                    <Text style={[styles.font, { textAlign: 'center', fontSize: 20 }]}>Detail Division</Text>
                    <View>
                        {this.state.isLeaderID !== 'leader' &&
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.setState({ modalEdit: true })}>
                                    <Icon name='edit-2' style={{ fontSize: 25, color: 'white', marginRight: 10, marginTop: 5, opacity: 0.6 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ modalDelete: true })}>
                                    <Icon name='trash-2' style={{ fontSize: 25, color: 'red', marginRight: 10, marginTop: 5, opacity: 0.6 }} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
                {this._searchBar()}
            </LinearGradient>
        )
    }
    _deleteModal() {
        const { modalDelete } = this.state
        const button = [{ backgroundColor: 'white', text: 'Cancel', color: 'black' },
        { backgroundColor: 'red', text: 'Delete', color: 'white' }]
        const setModalVisible = (params) => {
            if (params === 'red') {
                this.deleteDivision()
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
                        <Text>Are you sure want to delete this division?</Text>
                    </View>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270, marginBottom: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 270 }}>
                        {button.map((val, index) =>
                            <Button key={index} style={[styles.button, { backgroundColor: val.backgroundColor }]}
                                onPress={() => setModalVisible(val.backgroundColor)}>
                                <Text style={{ color: val.color }}>Cancel</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>
        )
    }
    _editModal() {
        const { divisionChange, modalEdit } = this.state
        const { params } = this.props.navigation.state
        var id = this.props.navigation.getParam('_id')
        const validation = () => {
            if (divisionChange === '') {
                Toast.show({
                    text: 'Form cannot be empty',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'yellow' }
                })
                this.setState({ modalEdit: false })
            } else {
                Toast.show({
                    text: 'Successfully edited',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'green' }
                })
                params.update(id, divisionChange)
                this.setState({ modalEdit: false })
            }
        }
        return (
            <Modal
                isVisible={modalEdit}
                onBackButtonPress={() => this.setState({ modalEdit: false })}
                animationInTiming={600}
                animationOutTiming={300}>
                <View style={styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 270 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Edit Division</Text>
                    </View>
                    <Item style={styles.Input} regular >
                        <Input
                            placeholder='Change division name'
                            style={{ borderWidth: 0, color: '#4c669f' }}
                            placeholderTextColor='gray'
                            onChangeText={(text) => this.setState({ divisionChange: text })}
                            value={divisionChange}
                        />
                    </Item>
                    <View style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, width: 270, marginBottom: 5 }} />
                    <Button info style={[styles.button, { backgroundColor: '#4c669f', alignSelf: 'flex-end', marginRight: '10%' }]}
                        onPress={() => validation()}>
                        <Text>Edit</Text>
                    </Button>
                </View>
            </Modal>
        )
    }
    _searchBar() {
        return (
            <Form style={styles.searchBar}>
                <Item floatingLabel>
                    <Label style={{ color: '#D3D3D3' }}>Search Employee..</Label>
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
                <Text style={{ color: 'grey', fontSize: 14, marginTop: 10, marginLeft: 20 }}>{datas[0]['project']}</Text>
                <View style={{ paddingLeft: 10, alignItems: 'flex-start', marginLeft: 30 }}>
                    <Text style={styles.titleProject} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>{datas[0]['name']}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='mail' style={styles.icon} />
                        <Text style={styles.status}>{datas[0]['email']}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='phone' style={styles.icon} />
                        <Text style={styles.status}>{datas[0]['phone']}</Text>
                    </View>
                </View>
            </View>
        )
    }
    _listEmployee() {
        const { data } = this.state
        return (
            <View style={{ marginLeft: -5 }}>
                {data.map((datas, index) =>
                    <ListEmployee
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
                {this._listEmployee()}
                {this._deleteModal()}
                {this._editModal()}
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
        maxHeight: 120,
        height: 120
    },
    searchBar: {
        marginTop: -16,
        marginHorizontal: '8%',

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
        marginTop: 4,
        color: 'grey',
        marginRight: 5
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
    Input: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        borderRadius: 4,
        borderColor: '#E8E8E8',
        height: 50,
        width: '80%',
        marginVertical: 20
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
        marginTop: -60,
        marginLeft: 40,
        elevation: 1
    },
    button: {
        borderRadius: 4,
        backgroundColor: 'white',
        marginTop: 10
    }
});