import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';
import { CardItem, Content, Item, Input, Badge, Tab, Tabs, Button, Text, Toast, TabHeading, Icon as IconTab } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import Tab1 from './Overview'
import Tab2 from './Module'
import Tab3 from './Activity'
import Tab4 from './Collaborator'
import Tab5 from './Issues'
import md5 from 'md5';
export default class DetailProjectContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataBackup: [],
            name: '',
            client: '',
            start: '',
            end: '',
            status: '',
            dataOverview: [],
            overview: [],
            password: this.props.navigation.getParam('password'),
            projectName: '',
            modalDelete: false,
            myProjectName: '',
            myPassword: '',
            secureTextEntry: true,
            activity: [],
            requirement: [],
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    push = () => {
        this.fetch({
            query: `{project(_id:"` + this.props.navigation.getParam('_id') + `") {
                code,
                name,
                status,
                start,
                end,
                problem,
                goal,
                objective,
                success,
                obstacle,
                client {
                  _id,
                  name
                },
                employee { password },
            }
        }`
        }).then(response => {
            var client_id
            var client_name
            var code = response.data.project.code
            var name = response.data.project.name
            var status = response.data.project.status
            var start = response.data.project.start
            var end = response.data.project.end
            var problem = response.data.project.problem
            var goal = response.data.project.goal
            var objective = response.data.project.objective
            var success = response.data.project.success
            var obstacle = response.data.project.obstacle
            response.data.project.client.forEach(function (item) {
                client_id = item._id
                client_name = item.name
            })
            this.setState({
                code: '[' + response.data.project.code + ']',
                status: response.data.project.status,
                projectName: response.data.project.name,
                dataOverview: [...this.state.dataOverview, {
                    code: code,
                    name: name,
                    status: status,
                    start: start,
                    end: end,
                    problem: problem,
                    goal: goal,
                    objective: objective,
                    success: success,
                    obstacle: obstacle,
                    client_id: client_id,
                    client_name: client_name
                }],
                overview: [...this.state.overview, {
                    code: code,
                    name: name,
                    client_id: client_id,
                    client_name: client_name,
                    start: start,
                    end: end
                }]
            })
        })
    }

    editProject(code, name, client, start, end) {
        const { params } = this.props.navigation.state
        const { dataOverview } = this.state
        this.fetch({
            query: `mutation {
                project_edit(
                  _id:"`+ this.props.navigation.getParam('_id') + `",
                  code:"`+ code + `",
                  name:"`+ name + `",
                  client:"`+ client + `",
                  start:"`+ start + `",
                  end:"`+ end + `"
                )
                {
                  client {
                    name
                  }
                }
              }`
        }).then(result => {
            var client_name
            var data = []
            var temp = []
            temp = result.data.project_edit.client
            temp.forEach(function (item) {
                client_name = item.name
            })
            data.push({
                code: code,
                name: name,
                client_id: client,
                client_name: client_name,
                start: start,
                end: end,
                problem: dataOverview[0].problem,
                goal: dataOverview[0].goal,
                objective: dataOverview[0].objective,
                success: dataOverview[0].success,
                obstacle: dataOverview[0].obstacle,
                status: dataOverview[0].status
            })
            this.setState({
                dataOverview: data
            })
            var activity_id = params.RDS(32, 'aA')
            var activity_code = 'P2'
            var activity_detail = ''
            var activity_date = new Date()
            this.activityAdd(activity_id, activity_code, activity_detail, activity_date)
        })
    }
    delete_validation() {
        const { myPassword, myProjectName, projectName, password } = this.state
        if (myProjectName === '' || myPassword === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        } else {
            if (myProjectName !== projectName) {
                Toast.show({
                    text: 'Wrong Project Name!',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'yellow' }
                })
            } else if (md5(myPassword) !== password) {
                Toast.show({
                    text: 'Wrong Password!',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'yellow' }
                })
            } else {
                return true
            }
        }
    }
    deleteProject() {
        if (this.delete_validation() === true) {
            this.fetch({
                query: `{
                project(_id:"`+ this.props.navigation.getParam('_id') + `") {
                  module {_id}
                }
              }`
            }).then(result => {
                this.setState({ modalDelete: false })
                if (result.data.project.module.length === 0) {
                    this.fetch({
                        query: `{
                            project(_id:"`+ this.props.navigation.getParam('_id') + `") {
                              activity{_id}
                            }
                          }`
                    }).then(response => {
                        const delActivity = (query) => fetch({ query: query })
                        response.data.project.activity.forEach(function (item) {
                            delActivity('mutation{activity_delete(_id:"' + item._id + '"){_id}}')
                        })
                        this.fetch({
                            query: `
                          mutation {
                            project_delete(_id:"`+ this.props.navigation.getParam('_id') + `"){_id}
                          }`
                        })
                    })
                    Toast.show({
                        text: 'Your project was successfully deleted',
                        buttonText: 'Undo',
                        duration: 3000,
                        textStyle: { color: 'green' }
                    })
                    this.props.navigation.navigate('Project')
                } else {
                    Toast.show({
                        text: 'Project requirement must be empty',
                        buttonText: 'Undo',
                        duration: 3000,
                        textStyle: { color: 'red' }
                    })
                }
            })
        }
    }
    activity(data) {
        this.setState({ activity: data })
    }
    activityAdd(activity_id, code, detail, date) {
        this.setState({
            activity: [...this.state.activity, {
                code: code,
                detail: detail,
                date: String(date),
            }]
        })
        this.fetch({
            query: `
        mutation {
          activity_add(
            _id:"`+ activity_id + `",
            project:"`+ this.props.navigation.getParam('_id') + `",
            code:"`+ code + `",
            detail:"`+ detail + `",
            date:"`+ date + `"
          ){_id}
        }`
        })
    }
    overview(data) {
        this.setState({ dataOverview: data })
    }
    overviewUpdate(code, name, client, client_id, start, end, status) {
        this.setState({
            overview: [{
                code: code,
                name: name,
                client: client,
                client_id: client_id,
                start: start,
                end: end
            }],
            status: status
        })
    }
    module(data) {
        this.setState({ requirement: data })
    }
    navigation(param) {
        const { params } = this.props.navigation.state

        if (param === 'edit-3') {
            this.props.navigation.navigate('EditProject',
                {
                    _id: this.props.navigation.getParam('_id'),
                    header: this._header.bind(this),
                    RDS: params.RDS.bind(this),
                    'editProject': this.editProject.bind(this),
                    'activityAdd': this.activityAdd.bind(this),
                    data: this.state.overview,
                    uri: this.props.navigation.getParam('uri')
                })
        } else if (param === 'play') {

        } else {
            this.setState({ modalDelete: true })
        }
    }
    setModalVisible(params) {
        if (params === '#f8f8f8') {
            this.setState({ modalDelete: false });
        } else {
            this.deleteProject()
        }
    }
    renderIcon = (style) => {
        const iconName = this.state.secureTextEntry ? 'eye-off' : 'eye';
        return (
            <Icon {...style} name={iconName} onPress={() => this.onIconPress()} style={{ fontSize: 20, marginRight: 7, color: 'grey' }} />
        );
    };
    onIconPress = () => {
        const secureTextEntry = !this.state.secureTextEntry;
        this.setState({ secureTextEntry });
    };
    _deleteModal() {
        const { modalDelete, myPassword, myProjectName, secureTextEntry } = this.state
        const button = [{ color: '#f8f8f8', text: 'Cancel', fontColor: 'black' },
        { color: 'red', text: 'Delete', fontColor: 'white' }]
        return (
            <Modal animationType={"fade"} transparent={true}
                visible={modalDelete}
                onRequestClose={() => { this.setState({ modalDelete: false }) }}>
                <View style={styles.Modal}>
                    <View style={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 300 }}>
                        <Text style={{ color: '#4c669f', fontSize: 20 }}>Delete Project</Text>
                    </View>
                    <Content style={{ width: 300 }}>
                        <Text style={styles.Subtitle}>Project Name</Text>
                        <Item style={styles.Input} regular >
                            <Input
                                style={{ borderWidth: 0, }}
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.setState({ myProjectName: text })}
                                value={myProjectName}

                            />
                        </Item>
                        <Text style={styles.Subtitle}>Password</Text>
                        <Item style={styles.Input} regular >
                            <Input
                                style={{ borderWidth: 0 }}
                                placeholderTextColor='grey'
                                onChangeText={(text) => this.setState({ myPassword: text })}
                                value={myPassword}
                                secureTextEntry={secureTextEntry}
                            />
                            {this.renderIcon()}
                        </Item>
                    </Content>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: 300 }}>
                        {button.map((datas, index) =>
                            <Button danger key={index} style={{ elevation: 1, marginBottom: 30, backgroundColor: datas.color, borderRadius: 4 }} onPress={() => this.setModalVisible(datas.color)}>
                                <Text style={{ color: datas.fontColor }}>{datas.text}</Text>
                            </Button>
                        )}
                    </View>
                </View>
            </Modal>
        )
    }

    _cardSettings() {
        const setting = [{ icon: 'edit-3', text: 'Edit Project', navigation: 'EditProject' },
        { icon: 'play', text: 'Start Project', navigation: '' },
        { icon: 'trash', text: 'Delete Project', navigation: '' },
        ]
        return (
            <CardItem style={styles.CardMenu}>
                <View>
                    <View style={{ flexDirection: 'row', borderBottomColor: '#D3D3D3', borderBottomWidth: 1, width: 310, justifyContent: 'space-between', position: 'absolute', marginTop: -25 }}>
                        <Text style={{ color: 'grey', fontSize: 12 }}>Project Setting</Text>
                        <Badge style={{ backgroundColor: this.props.navigation.getParam('color'), height: 18, marginBottom: 2 }}>
                            <Text style={{ color: 'white', fontSize: 10, marginTop: -5 }}>{this.props.navigation.getParam('status')}</Text>
                        </Badge>
                    </View>
                    {this.state.status === '0' &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: -20, width: 310 }}>
                            {setting.map((datas, index) =>
                                <TouchableOpacity key={index} onPress={() => this.navigation(datas.icon)}>
                                    <View style={{ flexDirection: 'column' }} >
                                        <Icon name={datas.icon} style={styles.MenuIcon}></Icon>
                                        <Text style={{ fontSize: 12, fontWeight: '100', color: '#24292e' }}>{datas.text}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                    {this.state.status === '1' &&
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: -20, width: 310 }}>
                            <TouchableOpacity>
                                <View style={{ flexDirection: 'column', justifyContent: 'center' }} >
                                    <Icon name='x' style={styles.MenuIcon}></Icon>
                                    <Text style={{ fontSize: 12, fontWeight: '100', color: '#24292e' }}>Close Project</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

            </CardItem>
        )
    }
    tabHeading(icon) {
        return (
            <TabHeading
                style={{ backgroundColor: '#fff', borderTopLeftRadius: 40, color: '#4c669f', borderTopRightRadius: 40 }}
                activeTextStyle={{ color: 'red' }}>
                <IconTab style={{ color: '#4c669f', fontSize: 25 }} name={icon} type='Feather' />
            </TabHeading>)
    }

    cardTab() {
        const { navigation } = this.props
        const { name, status, dataOverview } = this.state
        const { params } = this.props.navigation.state
        return (
            <View style={styles.CardTab}>
                <Tabs
                    tabContainerStyle={{ maxHeight: 50, flex: 1, backgroundColor: 'transparent', elevation: 0 }}
                    tabBarUnderlineStyle={{ backgroundColor: '#4c669f' }}>
                    <Tab
                        heading={this.tabHeading('file-text')}
                        tabStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 40 }}
                        textStyle={{ color: 'grey', fontSize: 12 }}
                        activeTabStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 40 }}
                        activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
                        <Tab1
                            navigation={navigation}
                            _id={this.props.navigation.getParam('_id')}
                            status={name}
                            header={this._header.bind(this)}
                            dataOverview={dataOverview}
                            uri={this.props.navigation.getParam('uri')}
                            activity={this.activityAdd.bind(this)}
                            update={this.overviewUpdate.bind(this)}
                            RDS={params.RDS.bind(this)} />
                    </Tab>
                    <Tab
                        heading={this.tabHeading('box')}
                        tabStyle={{ backgroundColor: '#fff' }}
                        textStyle={{ color: 'grey', fontSize: 12 }}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
                        <Tab2
                            navigation={navigation}
                            header={this._header.bind(this)}
                            uri={this.props.navigation.getParam('uri')}
                            RDS={params.RDS.bind(this)}
                            activity={this.activityAdd.bind(this)}
                            update={this.module.bind(this)} />
                    </Tab>
                    {status === '1' &&
                        <Tab
                            heading={this.tabHeading('users')}
                            tabStyle={{ backgroundColor: '#fff' }}
                            textStyle={{ color: 'grey', fontSize: 12 }}
                            activeTabStyle={{ backgroundColor: '#fff' }}
                            activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
                            <Tab4
                                navigation={navigation}
                                activity={this.activity}
                                header={this._header.bind(this)}
                                uri={this.props.navigation.getParam('uri')} />
                        </Tab>
                    }
                    {status === '1' &&
                        <Tab
                            heading={this.tabHeading('alert-circle')}
                            tabStyle={{ backgroundColor: '#fff' }}
                            textStyle={{ color: 'grey', fontSize: 12 }}
                            activeTabStyle={{ backgroundColor: '#fff' }}
                            activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
                            <Tab5
                                navigation={navigation}
                                _id={this.props.navigation.getParam('_id')}
                                header={this._header.bind(this)}
                                uri={this.props.navigation.getParam('uri')} />
                        </Tab>
                    }
                    <Tab
                        heading={this.tabHeading('activity')}
                        tabStyle={{ backgroundColor: '#fff', borderTopRightRadius: 40 }}
                        textStyle={{ color: 'grey', fontSize: 12 }}
                        activeTabStyle={{ backgroundColor: '#fff', borderTopRightRadius: 40 }}
                        activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
                        <Tab3
                            navigation={navigation}
                            header={this._header.bind(this)}
                            uri={this.props.navigation.getParam('uri')}
                            activity={this.state.activity}
                            update={this.activity.bind(this)} />
                    </Tab>
                </Tabs>
            </View>
        )
    }
    header(...data) {
        return (
            <View>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    backgroundColor="#4c669f"
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                    <View style={{ marginTop: 8, justifyContent: 'flex-start', flexDirection: 'row', elevation: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                        </TouchableOpacity>
                        <Text style={[styles.font, { textAlign: 'left', marginLeft: 10, fontSize: 20, fontWeight: 'bold', width: 300 }]} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>Detail Project</Text>
                    </View>
                    <Text style={[styles.font, { marginLeft: 15, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }]}>{this.state.code}</Text>
                    <View style={{ marginHorizontal: 30 }}>
                        <Card
                            body={this._cardSettings()} />
                    </View>
                    {this.cardTab()}
                </LinearGradient>
            </View>
        )
    }
    _header(Title) {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={[styles.mainScreen, styles.upperScreen]}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                    <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, marginTop: 6, fontWeight: 'bold' }]} />
                </TouchableOpacity>
                <Text style={styles.title}>{Title}</Text>
            </LinearGradient>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    backgroundColor="#4c669f"
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                    <View style={{ marginTop: 8, justifyContent: 'flex-start', flexDirection: 'row', elevation: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                        </TouchableOpacity>
                        <Text style={[styles.font, { textAlign: 'left', marginLeft: 10, fontSize: 20, fontWeight: 'bold', width: 300 }]} ellipsizeMode='tail' maxLength={20} numberOfLines={1}>Detail Project</Text>
                    </View>
                    <Text style={[styles.font, { marginLeft: 15, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }]}>{this.state.code}</Text>
                    <View style={{ marginHorizontal: 30 }}>
                        <Card
                            body={this._cardSettings()} />
                    </View>
                    {this.cardTab()}
                </LinearGradient>
                {this._deleteModal()}
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
        fontWeight: '100',
        color: '#24292e'
    },
    CardTab: {
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        flex: 1,
        backgroundColor: 'white',
        marginTop: 40
    },
    Modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        height: 300,
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
    },

    mainScreen: {
        flex: 1,
        backgroundColor: '#0881a3',
    },
    upperScreen: {
        maxHeight: 50,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#000',
        shadowRadius: 2,
        borderColor: '#ddd',
        borderRadius: 2,
        flexDirection: 'row',
        height: 50
    },
    title: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    }
});