import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar, Modal } from 'react-native';
import { Left, Right, CardItem, Content, Item, Input, Badge, Tab, Tabs, Button, Text, Body, Picker, Form, Textarea } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import ListRequirement from '../../layout/ListItem'
export default class RequirementContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataModule: [],
            modalRequirement: false,
            requirementID: '',
            requirementName: '',
            detailRequirement: '',
            moduleList: '',
            statusProject: '',
            label: ''
        }
        //this.push()
    }
    componentDidMount() {
        var temp = this.props.navigation.getParam('data')
        var data = []
        var moduleTemp = this.props.navigation.getParam('dataModule')
        var dataModule = []
        moduleTemp.forEach(function (item) {
            dataModule.push({
                id: item.id,
                name: item.name
            })
        })
        temp.forEach(function (item) {
            data.push({
                number: '-',
                id: item.id,
                name: item.name,
                detail: item.detail,
                module: item.module
            })
        })

        this.setState({
            data: data,
            statusProject: this.props.navigation.getParam('statusProject'),
            dataModule: dataModule
        })

    }
    setModalRequirementVisible(requirementID, requirementName, detailRequirement, moduleList) {
        this.setState({ modalRequirement: true, requirementID: requirementID, requirementName: requirementName, detailRequirement: detailRequirement, moduleList: moduleList });
    }
    setRequirementButton(indicator) {
        const { params } = this.props.navigation.state
        const { requirementID, requirementName, detailRequirement, moduleList, data, dataModule } = this.state
        if (indicator === 'red') {

        } else {
            params.requirementSave(requirementID, requirementName, detailRequirement, moduleList)
            var edit_change = 0
            var dataRequirement = data
            var module_name
            var module_id
            var index = 0
            dataRequirement.forEach(function (requirement) {
                if (requirement.id === requirementID) {
                    module_name = dataModule[index]['name']
                    module_id = dataModule[index]['id']
                    if (requirement.module !== moduleList) {
                        edit_change = 1
                    }
                }
                index = index + 1
            })


            if (edit_change === 0) {
                dataRequirement.forEach((requirement, index) => {
                    if (requirement.id === requirementID) {
                        requirement.number = '-'
                        requirement.id = requirementID
                        requirement.name = requirementName
                        requirement.detail = detailRequirement
                        requirement.module = moduleList
                    }
                })
            } else if (edit_change === 1) {
                dataRequirement.forEach((requirement, index) => {
                    if (requirement.id === requirementID) {
                        dataRequirement.splice(index, 1)
                    }
                })
            }
            this.setState({ modalRequirement: false, data: dataRequirement })
        }
    }
    pickerChange(index) {
        const { dataModule } = this.state
        dataModule.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: dataModule[index].name,
                    moduleList: dataModule[index].id
                })
            }
        })

    }
    _modalRequirement() {
        const { modalRequirement, requirementName, detailRequirement, data, moduleList, statusProject, dataModule } = this.state
        const button = [
            { color: 'red', text: 'Delete', fontColor: 'white' },
            { color: '#4c669f', text: 'Save', fontColor: 'white' },
        ]
        var status = false
        if (statusProject === '1') {
            status = true
        }
        const { params } = this.props.navigation.state

        return (
            <Modal
                animationType={"fade"} transparent={true}
                visible={modalRequirement}
                onRequestClose={() => { this.setState({ modalRequirement: false }) }}>
                <View style={status ? [styles.Modal, { height: 360 }] : styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 300 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Requirement</Text>
                    </View>
                    <Content style={{ width: 300 }} >
                        <Text style={styles.Subtitle}>Module</Text>
                        <Item style={styles.Input} picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select your SIM"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={moduleList}
                                onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                                enabled={!status}>
                                {
                                    dataModule.map((v, index) => {
                                        return <Picker.Item label={v.name} value={v.id} key={index} />
                                    })
                                }
                            </Picker>
                        </Item>
                        <Text style={styles.Subtitle}>Name</Text>
                        <Item style={styles.Input} regular>
                            <Input
                                style={{ borderWidth: 0 }}
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.setState({ requirementName: text })}
                                value={requirementName}
                                disabled={status}
                            />
                        </Item>
                        <Text style={styles.Subtitle}>Detail</Text>
                        <Form style={[styles.Input, { height: 100 }]} regular >
                            <Content>
                                <Textarea
                                    style={{ borderWidth: 0 }}
                                    rowSpan={10}
                                    placeholderTextColor='grey'
                                    onChangeText={(text) => this.setState({ detailRequirement: text })}
                                    value={detailRequirement}
                                    multiline={true}
                                    disabled={status}
                                />
                            </Content>
                        </Form>
                    </Content>
                    {statusProject === '0' &&
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: 300 }}>
                            {button.map((datas, index) =>
                                <Button danger key={index} style={{ elevation: 1, marginBottom: 30, backgroundColor: datas.color, borderRadius: 4 }}
                                    onPress={() => this.setRequirementButton(datas.color)}>
                                    <Text >{datas.text}</Text>
                                </Button>
                            )}
                        </View>}
                </View>
            </Modal>
        )
    }
    _listBody(...datas) {
        return (
            <Body style={{ marginVertical: -10 }}>
                <TouchableOpacity onLongPress={() => this.setModalRequirementVisible(datas[0]['id'], datas[0]['name'], datas[0]['detail'], datas[0]['module'])}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text ellipsizeMode='tail' maxLength={20} numberOfLines={1} style={{ width: 200 }}>{datas[0]['name']}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Body>
        )
    }
    render() {
        const { params } = this.props.navigation.state
        const { data } = this.state
        return (
            <View style={{ flex: 1 }}>
                {params.header('Requirement')}
                {data.map((datas, key) =>
                    <ListRequirement
                        key={key}
                        Body={this._listBody(datas)}
                    />
                )}
                {this._modalRequirement()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        height: 450,
        width: '80%',
        borderRadius: 10,
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
    }
});