import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar, Modal } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Toast, Button, Form, Textarea, Picker, Body } from 'native-base';
import { List, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import FAB from '../../layout/FAB';
import LinearGradient from 'react-native-linear-gradient'
import ListModule from '../../layout/ListItem';
import { StackActions } from 'react-navigation';

export default class ModuleContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            modalModule: false,
            modalRequirement: false,
            dataModule: [],
            moduleName: '',
            detailModule: '',
            moduleID: '',
            requirementName: '',
            detailRequirement: '',
            requirementID: '',
            label: '',
            moduleList: '',
            statusProject: ''
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.uri });
    insert_replace(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '\\n')
    }
    push() {
        this.fetch({
            query: `{
            project(_id:"`+ this.props.navigation.getParam('_id') + `") {
            status,
              module {
                _id,
                name,
                detail,
                requirement {
                  _id,
                  name,
                  detail
                }
              }
            }
          }`
        }).then(result => {
            var data = []
            var dataModule = []
            var temp = result.data.project.module
            this.setState({ statusProject: result.data.project.status })
            temp.forEach(function (item_m) {
                var requirement = []
                item_m.requirement.forEach(function (item_r) {
                    requirement.push({
                        number: '-',
                        id: item_r._id,
                        name: item_r.name,
                        detail: item_r.detail,
                        module: item_m._id
                    })
                })
                data.push({
                    id: item_m._id,
                    name: item_m.name,
                    detail: item_m.detail,
                    requirement: requirement,
                })
                dataModule.push({
                    id: item_m._id,
                    name: item_m.name,
                })
            })
            this.setState({
                data: data,
                dataModule: dataModule
            })
            this.props.update(data)
        })
    }

    saveValidation(name, detail, module) {
        if (name === '' || detail === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        } else {
            return true
        }
    }
    moduleSave(_id, _name, _detail) {
        if (this.saveValidation(_name, _detail) === true) {
            var id = _id
            var name = _name
            var detail = _detail
            this.fetch({
                query: `
          mutation {
            module_edit(
              _id:"`+ id + `",
              name:"`+ name + `",
              detail:"`+ this.insert_replace(detail) + `"
            ){_id}
          }`
            })
            var data = this.state.data
            data.forEach(function (item) {
                if (item.id === id) {
                    var version = parseInt(item.id) + 1
                    item.id = item.id + '_' + version
                    item.name = name
                    item.detail = detail
                }
            })
            this.setState({ data: data })
            var activity_id = this.props.RDS(32, 'aA')
            var activity_code = 'M1'
            var activity_detail = name
            var activity_date = new Date()

            this.props.activity(activity_id, activity_code, activity_detail, activity_date)
            this.setState({ modalModule: false })
        }
    }
    moduleValidation(moduleName, detailModule) {
        if (moduleName === '' || detailModule === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        } else {
            return true
        }
    }
    moduleAdd(moduleName, detailModule) {
        if (this.moduleValidation(moduleName, detailModule) === true) {
            var id = this.props.RDS(32, 'aA')
            this.fetch({
                query: `
            mutation {
              module_add(
                _id:"`+ id + `",
                project:"`+ this.props.navigation.getParam('_id') + `",
                name:"`+ moduleName + `",
                detail:"`+ this.insert_replace(detailModule) + `"
              ){_id}
            }`
            })
            var activity_id = this.props.RDS(32, 'aA')
            var activity_code = 'M0'
            var activity_detail = moduleName
            var activity_date = new Date()
            this.props.activity(activity_id, activity_code, activity_detail, activity_date)
            Toast.show({
                text: 'Module added',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'green' }
            })
            this.setState({
                data: [...this.state.data, {
                    id: id,
                    name: moduleName,
                    detail: detailModule,
                    requirement: [],
                }]
            })
            this.props.navigation.dispatch(StackActions.popToTop());
        }
    }
    requirementAdd(moduleList, requirementName, detailRequirement) {
        var id = this.props.RDS(32, 'aA')
        this.fetch({
            query: `
         mutation {
           requirement_add(
             _id:"`+ id + `",
             project:"`+ this.props.navigation.getParam('_id') + `",
             module:"`+ moduleList + `",
             name:"`+ requirementName + `",
             detail:"`+ this.insert_replace(detailRequirement) + `",
             status:"0"
           ){_id}
         }`
        })
        var activity_id = this.props.RDS(32, 'aA')
        var activity_code = 'R0'
        var activity_detail = requirementName + '_' + moduleList.split('_')[1]
        var activity_date = new Date()
        this.props.activity(activity_id, activity_code, activity_detail, activity_date)
        let data = this.state.data
        data.forEach(function (item) {
            if (item.id === moduleList) {
                item.requirement = [...item.requirement, {
                    number: '-',
                    id: id,
                    name: requirementName,
                    detail: detailRequirement,
                    module: moduleList
                }]
            }
        })
        this.setState({ data: data })
    }
    requirementSave(_id, _name, _detail, _module) {
        this.saveValidation(_name, _detail, _module)
        if (this.saveValidation(_id, _name, _detail) === true) {
            var id = _id
            var edit_name = _name
            var edit_detail = _detail
            var edit_module = _module
            this.fetch({
                query: `
             mutation{
               requirement_edit(
                 _id:"`+ id + `",
                 module:"`+ edit_module + `",
                 name:"`+ edit_name + `",
                 detail:"`+ this.insert_replace(edit_detail) + `"
               ){_id}
             }`
            })
            var edit_change = 0
            var data = this.state.data
            var module_name = null
            data.forEach(function (module) {
                module.requirement.forEach(function (requirement) {
                    if (requirement.id === id) {
                        module_name = module.name
                        if (requirement.module !== edit_module) {
                            edit_change = 1
                        }
                    }
                })
            })
            if (edit_change === 0) {
                data.forEach(function (module) {
                    module.requirement.forEach(function (requirement) {
                        if (requirement.id === id) {
                            requirement.name = edit_name
                            requirement.detail = edit_detail
                        }
                    })
                })
            } else if (edit_change === 1) {
                data.forEach(function (module) {
                    module.requirement.forEach(function (requirement, index) {
                        if (requirement.id === id) {
                            module.requirement = module.requirement.splice(index, 1)
                        }

                    })
                })
                data.forEach(function (module) {
                    if (module.id === edit_module) {
                        module.requirement = [...module.requirement, {
                            number: '-',
                            id: id,
                            name: edit_name,
                            detail: edit_detail,
                            module: edit_module
                        }]
                    }
                })
            }

            var activity_id = this.props.RDS(32, 'aA')
            var activity_code = 'R1'
            var activity_detail = edit_name + '_' + module_name
            var activity_date = new Date()
            this.setState({ data: data })
            this.props.activity(activity_id, activity_code, activity_detail, activity_date)
        }
    }
    pickerChange(index) {
        const { data } = this.state
        data.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: data[index].name,
                    moduleList: data[index].id
                })
            }
        })

    }
    setModalModuleVisible(id, name, detail) {
        this.setState({ modalModule: true, moduleID: id, moduleName: name, detailModule: detail });
    }

    setModuleButton(params) {
        const { moduleID, moduleName, detailModule, moduleList } = this.state
        if (params === 'red') {

        } else {
            this.moduleSave(moduleID, moduleName, detailModule, moduleList)
        }
    }

    _listBody(...datas) {
        const { dataModule } = this.state
        return (
            <Body style={{ marginVertical: -10 }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Requirement', {
                    _id: datas[0]['id'],
                    data: datas[0]['requirement'],
                    header: this.props.header.bind(this),
                    statusProject: this.state.statusProject,
                    requirementSave: this.requirementSave.bind(this),
                    dataModule: dataModule
                })}
                    onLongPress={() => this.setModalModuleVisible(datas[0]['id'], datas[0]['name'], datas[0]['detail'])}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                            <Text ellipsizeMode='tail' maxLength={20} numberOfLines={1} style={{ width: 200 }}>{datas[0]['name']}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Body>
        )
    }
    _listRight(...datas) {
        const { dataModule } = this.state
        return (
            <Right>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Requirement', {
                    data: datas[0]['requirement'],
                    header: this.props.header.bind(this),
                    statusProject: this.state.statusProject,
                    requirementSave: this.requirementSave.bind(this),
                    dataModule: dataModule
                })}>
                    <Icon name='chevron-right' style={{ fontSize: 25, marginRight: 10, color: 'grey' }} />
                </TouchableOpacity>
            </Right>
        )
    }
    _modalModule() {
        const { modalModule, moduleName, detailModule, statusProject } = this.state
        const button = [
            { color: 'red', text: 'Delete', fontColor: 'white' },
            { color: '#4c669f', text: 'Save', fontColor: 'white' },
        ]
        var status = false
        if (statusProject === '1') {
            status = true
        }
        return (
            <Modal
                animationType={"fade"} transparent={true}
                visible={modalModule}
                onRequestClose={() => { this.setState({ modalModule: false }) }}>
                <View style={status ? [styles.Modal, { height: 350 }] : styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 300 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Module</Text>
                    </View>
                    <Content style={{ width: 300 }}>
                        <Text style={styles.Subtitle}>Name</Text>
                        <Item style={styles.Input} regular >
                            <Input
                                style={{ borderWidth: 0 }}
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.setState({ moduleName: text })}
                                value={moduleName}
                                disabled={status}
                            />
                        </Item>
                        <Text style={styles.Subtitle}>Detail</Text>
                        <Form style={[styles.Input, { height: 150 }]} regular >
                            <Content>
                                <Textarea
                                    style={{ borderWidth: 0 }}
                                    rowSpan={10}
                                    placeholderTextColor='grey'
                                    onChangeText={(text) => this.setState({ detailModule: text })}
                                    value={detailModule}
                                    multiline={true}
                                    disabled={status}
                                />
                            </Content>
                        </Form>
                    </Content>
                    {statusProject === '0' &&
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: 300 }}>
                            {button.map((datas, index) =>
                                <Button danger key={index} style={{ elevation: 1, marginBottom: 30, backgroundColor: datas.color, borderRadius: 4 }} onPress={() => this.setModuleButton(datas.color)}>
                                    <Text >{datas.text}</Text>
                                </Button>
                            )}
                        </View>}
                </View>
            </Modal>
        )
    }

    _accordionModule() {
        const { data } = this.state
        return (
            <List.Section style={{ marginVertical: -10 }} title="Module">
                {data.map((datas, index) =>
                    <TouchableOpacity onLongPress={() => this.setModalModuleVisible(datas)} key={index} >
                        <List.Accordion
                            title={datas.name}
                            style={{ marginVertical: -10 }}
                            theme={{ colors: { primary: '#4c669f' } }}
                            titleStyle={{ fontSize: 13 }}
                            //description={datas.detail}
                            descriptionNumberOfLines={1}
                            descriptionStyle={{ fontSize: 11 }}>
                            {datas.requirement.map((datas_r, index_r) =>
                                <TouchableOpacity key={index_r}  >
                                    <List.Item
                                        title={datas_r.name}
                                        style={{ marginLeft: 20, marginVertical: -5, }}
                                        titleStyle={{ fontSize: 13 }}
                                    />
                                </TouchableOpacity>
                            )}
                            <List.Item title='' style={{ marginLeft: 20, height: 20 }} />
                        </List.Accordion>
                    </TouchableOpacity>
                )}
            </List.Section>
        )
    }
    render() {
        const listFab = [{
            'key': '1',
            "title": "Add Module",
            "icon": "plus",
            'action': 'AddModule',
            'id': this.props.navigation.getParam('_id'),
            'uri': this.props.uri,
            'function': this.moduleAdd.bind(this)
        },
        {
            'key': '2',
            "title": "Add Requirement",
            "icon": "plus",
            'action': 'AddRequirement',
            'id': this.props.navigation.getParam('_id'),
            'uri': this.props.uri,
            'function': this.requirementAdd.bind(this)
        }]
        const { statusProject, data } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginLeft: 10, fontWeight: '700', fontSize: 14, color: 'grey' }}>Module</Text>
                <Content style={{ flex: 1 }}>
                    {data.map((datas, key) =>
                        <ListModule
                            key={key}
                            Body={this._listBody(datas)}
                            Right={this._listRight(datas)}
                        />
                    )}
                </Content>
                {this._modalModule()}

                {statusProject === '0' &&
                    <FAB
                        listFab={listFab}
                        navigation={this.props.navigation}
                        header={this.props.header.bind(this)}
                    />}

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