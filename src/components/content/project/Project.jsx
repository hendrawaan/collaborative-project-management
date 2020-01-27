import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar, ScrollView } from 'react-native';
import { Left, Right, CardItem, Content, Item, Input, Badge } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import FAB from '../../layout/FAB';
import { StackActions } from 'react-navigation';
const row = ['START DATE', 'CODE']
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default class ProjectContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            password: '',
            projectName: '',
            activity: []
        }
        this.push()
        this.activity = this.activity.bind(this)
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    reload() {
        this.setState({ data: [] })
        this.push()
    }
    randomString(length, chars) {
        let mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        let result = '';
        for (let i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }
    insert_replace(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '\\n')
    }
    push = async () => {
        const retrievedOrganization = await AsyncStorage.getItem('organization');
        const retrievedUser = await AsyncStorage.getItem('user')
        const itemOrganization = JSON.parse(retrievedOrganization);
        const itemUser = JSON.parse(retrievedUser);
        this.setState({ organization: itemOrganization, user: itemUser })
        let user = this.state.user
        this.fetch({
            query: `{
                myProject(employee:"`+ user + `") {
                  _id,
                  code,
                  name,
                  status,
                  start,
                  end,
                  client {
                    name
                  },
                  employee {
                    _id,
                    password,
                  },
                  module {
                    requirement {
                      status
                    }
                  }
                }
              }`
        }).then(response => {
            let data = []
            let pass = ''
            let name = ''
            if (response.data.myProject !== null) {
                let temp = response.data.myProject
                temp.forEach(function (item, index_project) {
                    if (item.employee[0]['_id'] === user) {
                        let client = ''
                        pass = item.employee[0]['password']
                        name = item.name
                        item.client.forEach(function (item_client) {
                            client = item_client.name
                        })
                        let start = new Date(item.start); let end = new Date(item.end)
                        let start_text = ('0' + start.getDate()).slice(-2) + '-' + ('0' + (start.getMonth() + 1)).slice(-2) + '-' + start.getFullYear()
                        let end_text = ('0' + end.getDate()).slice(-2) + '-' + ('0' + (end.getMonth() + 1)).slice(-2) + '-' + end.getFullYear()
                        let progress = null
                        let color = ''
                        if (item.status === '0') {
                            progress = 'Preparing'
                            color = '#add8e6'
                        }
                        else if (item.status === '2') {
                            progress = 'Closed'
                            color = '#90ee90'
                        }
                        else if (item.status === '1') {
                            let counter = 0
                            item.module.forEach(function (modul, index_progress) {
                                let all = temp[index_progress].module[index_progress]['requirement'].length
                                let done = modul.requirement.filter(function (search) { return search.status === '1' })
                                if (all === done.length) { counter++ }
                            })

                            progress = 'On Progress (' + Math.round(counter / temp[index_project].module.length * 100) + '%)'
                            color = '#CCCC00'
                        }
                        data.push({
                            id: item._id,
                            project: item.name,
                            client: client,
                            start: start_text,
                            end: end_text,
                            code: '[' + item.code + ']',
                            progress: progress,
                            color: color
                        })
                    }
                })
                this.setState({
                    data: data,
                    dataBackup: data,
                    password: pass,
                    projectName: name
                })

            } else {
                return (
                    <View>
                        <Text>
                            Wanna Start your first project?
                        </Text>
                    </View>
                )
            }
        }).catch((error) => {
            return error
        })
    }
    addProject(client, code, name, start, end, problem, goal, objective, success, obstacle) {
        const { user, organization } = this.state
        var start_date = new Date(start); var end_date = new Date(end)
        var _id = this.randomString(32, 'aA');
        this.fetch({
            query: `
         mutation {
           project_add(
             _id:"`+ _id + `",
             organization:"`+ organization + `",
             employee:"`+ user + `",
             client:"`+ client.split('_')[0] + `",
             code:"`+ code + `",
             name:"`+ name + `",
             start:"`+ start_date + `",
             end:"`+ end_date + `",
             problem:"`+ this.insert_replace(problem) + `",
             goal:"`+ this.insert_replace(goal) + `",
             objective:"`+ this.insert_replace(objective) + `",
             success:"`+ this.insert_replace(success) + `",
             obstacle:"`+ this.insert_replace(obstacle) + `",
             status:"0"
           ){_id}
         }`
        })
        var activity_id = this.randomString(32, 'aA');
        var activity_date = new Date()
        this.fetch({
            query: `
           mutation {
             activity_add(
               _id:"`+ activity_id + `",
               project:"`+ _id + `",
               code:"P0",
               detail:"",
               date:"`+ activity_date + `"
             ){_id}
           }`
        })
        let start_text = ('0' + start_date.getDate()).slice(-2) + '-' + ('0' + (start_date.getMonth() + 1)).slice(-2) + '-' + start_date.getFullYear()
        let end_text = ('0' + end_date.getDate()).slice(-2) + '-' + ('0' + (end_date.getMonth() + 1)).slice(-2) + '-' + end_date.getFullYear()
        this.setState({
            data: [...this.state.data, {
                id: _id,
                project: name,
                client: client.split('_')[1],
                start: start_text,
                end: end_text,
                code: '[' + code + ']',
                progress: 'Preparing',
                color: '#add8e6'
            }]
        })
        this.props.navigation.dispatch(StackActions.popToTop());
    }
    activity(code, detail, date) {
        this.setState({
            activity: [...this.state.activity, {
                code: code,
                detail: detail,
                date: String(date),
            }]
        })
    }
    days = (date) => {
        date = date.split("-")
        date = new Date(date[2], date[1] - 1, date[0])
        let round = Math.round((date - new Date()) / 86400000);
        if (round > 0)
            return round;
        else
            return 0;
    }
    days_between(date1, date2) {
        const ONE_DAY = 1000 * 60 * 60 * 24;
        const differenceMs = Math.abs(date1 - date2);
        return Math.round(differenceMs / ONE_DAY);

    }
    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        let data = this.state.dataBackup;
        var searchText = searchText.trim().toLowerCase();
        data = data.filter(l => {
            return l.code.toLowerCase().match(searchText) || l.project.toLowerCase().match(searchText);
        });
        this.setState({
            data: data
        });
    }
    header = () => {
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
                    <View style={{ marginTop: 8, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, fontWeight: 'bold', marginTop: -1, marginLeft: 10 }]} />
                        </TouchableOpacity>
                        <Text style={[styles.font, { textAlign: 'center', marginLeft: 20, fontSize: 20, fontWeight: 'bold' }]}>Project List</Text>
                        <TouchableOpacity onPress={() => this.reload()}>
                            <Icon name='refresh-ccw' size={20} color='white' style={{ marginRight: 10, textAlign: 'right', marginTop: 5 }} />
                        </TouchableOpacity>
                    </View>
                    <Item style={styles.SearchBar} regular>
                        <Input style={{ borderWidth: 0 }} placeholderTextColor='white' placeholder='Search Project..' onChange={this.setSearchText.bind(this)} />
                        <Icon name='search' size={25} color='white' style={{ marginRight: 10 }}></Icon>
                    </Item>
                </LinearGradient>
            </View>
        )
    }
    /* */

    card_body = (...datas) => {
        return (
            <CardItem style={[styles.Card, { borderLeftColor: datas[0]['color'] }]}>
                <View >
                    <Text style={styles.days}>{this.days(datas[0]['end'])}</Text>
                    <Text style={styles.remaining}>Days {"\n"}remaining</Text>
                </View>
                <View>
                    <View
                        style={{
                            borderLeftWidth: 1,
                            borderLeftColor: '#D3D3D3',
                            marginHorizontal: 7,
                            height: 80,
                        }}
                    />
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', flex: 1, }}>
                    <Text style={styles.Title} maxLength={33} ellipsizeMode='tail' numberOfLines={1}>{datas[0]['project']}</Text>
                    <View style={{ flexDirection: 'row', marginTop: -3, borderBottomColor: '#D3D3D3', borderBottomWidth: 1 }}>
                        <Icon name='user' style={styles.MiniIcon}></Icon>
                        <Text style={styles.Subtitle} maxLength={25} ellipsizeMode='tail' numberOfLines={1}>{datas[0]['client']}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, width: 145 }}>
                        {row.map((rows) =>
                            <Text key={rows} style={styles.row}>    {rows}</Text>)}
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, }}>
                        <Text style={{ fontSize: 12, color: 'grey', fontWeight: 'bold' }}>  {datas[0]['start']}</Text>
                        <Text style={{ fontSize: 12, color: 'grey', fontWeight: 'bold', width: 100, textAlign: 'center' }}>{datas[0]['code']}</Text>
                        <Badge style={{ backgroundColor: datas[0]['color'], marginTop: -10, height: 18 }}>
                            <Text style={{ color: 'white', fontSize: 10 }}>{datas[0]['progress']}</Text>
                        </Badge>
                    </View>

                </View>
            </CardItem>
        )
    }

    Card_Project() {
        return (
            <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                {this.state.data.map((datas, index) =>
                    <TouchableOpacity
                        key={index}
                        onPress={() => this.props.navigation.navigate('DetailProject', {
                            _id: datas.id,
                            color: datas.color,
                            status: datas.progress,
                            password: this.state.password,
                            projectName: this.state.projectName,
                            activity: this.activity.bind(this),
                            RDS: this.randomString.bind(this),
                            uri: this.props.navigation.getParam('uri')
                        })}>
                        <Card
                            body={this.card_body(datas)} />
                    </TouchableOpacity>
                )}

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
        const listFab = [{
            'key': '1',
            "title": "Add Project",
            "icon": "plus",
            'action': 'AddProject',
            'id': '1',
            'uri': this.props.navigation.getParam('uri'),
            'function': this.addProject.bind(this)
        }]
        return (
            <View style={{ flex: 1 }}>
                <Content>
                    {this.header()}
                    {this.Card_Project()}
                </Content>
                <FAB
                    listFab={listFab}
                    navigation={this.props.navigation}
                    header={this._header.bind(this)}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Header: {
        backgroundColor: 'white',
    },
    Subtitle: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 5,
        fontWeight: '600',
        width: 200
    },
    MiniIcon: {
        fontSize: 14,
        color: 'grey',
        marginTop: 2
    },
    Title: {
        fontWeight: 'bold',
        marginVertical: 5,
        marginTop: -5,
        fontSize: 15,
        width: 250
    },
    Card: {
        borderRadius: 4,
        borderLeftColor: getRandomColor(),
        borderLeftWidth: 10,
        height: 100
    },
    days: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    remaining: {
        fontSize: 8,
        color: 'grey',
        textAlign: 'center',
    },
    row: {
        fontSize: 10,
        marginTop: 5,
        color: 'grey',
        textAlign: 'center'
    },
    header: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        maxHeight: 150,
        height: 150,
    },
    SearchBar: {
        backgroundColor: 'white',
        opacity: 0.5,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 10
    },
    font: {
        color: 'white'
    },
    FAB: {
        alignItems: 'flex-end'
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
    },
});