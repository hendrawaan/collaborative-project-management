import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import Timeline from 'react-native-timeline-flatlist'
export default class ActivityContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            isRefreshing: false,
            waiting: false,
        }
    }
    fetch = createApolloFetch({ uri: this.props.uri });
    componentDidMount() {
        this.fetch({
            query: `{
            project(_id:"`+ this.props.navigation.getParam('_id') + `") {
              activity { code, detail, date },
            }
          }`}).then(result => {
                this.props.update(result.data.project.activity)
            })
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            data: props.activity
        })
    }

    renderDetail(rowData, sectionID, rowID) {
        let title = null
        var desc = null
        var color = ''
        if (rowData.lineColor === '#007944') {
            color = '#007944'
        } else if (rowData.lineColor === '#FF8C00') {
            color = '#FF8C00'
        } else if (rowData.lineColor === '#1E88F5') {
            color = '#1E88F5'
        } else if (rowData.lineColor === '#CD0000') {
            color = '#CD0000'
        }
        title = (
            <View style={styles.timeContainer}>
                <Text style={[styles.title]}>{rowData.title}</Text>
            </View>
        )
        desc = (
            <View style={[styles.descriptionContainer, { backgroundColor: color }]}>
                <Text style={[styles.textDescription]}>{rowData.description}</Text>
            </View>
        )
        return (
            <View style={{ flex: 1, marginTop: -5 }}>
                {title}
                {desc}
            </View>
        )
    }
    render() {
        let temp = this.state.data

        var data = []
        var tempDate
        var j = 0
        var status = 0
        j = temp.length - 1
        for (let i = temp.length - 1; i >= 0; i--) {
            var date = new Date(temp[i]['date'])
            var title = temp[i]['date'].substr(0, 15)
            var hour = date.getHours()
            var minute = date.getMinutes()
            var day = date.getDay()
            var year = date.getFullYear()
            var month = date.getMonth()
            var time = ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2)
            var x = i - 1
            // if (i < temp.length - 1 && i != 0) {
            //     tempDate = new Date(temp[x]['date'])
            // } else if (i === 0) {
            //     tempDate = new Date(temp[i]['date'])

            // } else if (i === j) {
            //     status = 1
            // }
            // if (i == (temp.length - 1)) {
            //     if (day - 1 === new Date().getDay() - 1) {
            //         data.push({
            //             title: 'Yesterday'
            //         })
            //     } else {
            //         data.push({
            //             title: temp[i]['date']
            //         })
            //     }
            // }
            // if (tempDate != null && tempDate.getDay() == date.getDay()) {
            //     status = 1
            // }
            // if (status === 1) {
            //     data.push({
            //         title: temp[i]['date']
            //     })
            //     status = 0
            //     console.log(j)
            // }
            if (temp[i]['code'] === 'P0') {
                data.push({
                    time: time,
                    description: 'This project is created',
                    icon: require('../../../assets/image/ActivityIcon/box.png'),
                    lineColor: '#007944',
                    title: title
                })
            } else if (temp[i]['code'] === 'P1') {
                data.push({
                    time: time,
                    description: 'Project overview is updated',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/box.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'P2') {
                data.push({
                    time: time,
                    description: 'Project agreement is edited',
                    icon: require('../../../assets/image/ActivityIcon/box.png'),
                    lineColor: '#007944',
                    title: title
                })
            } else if (temp[i]['code'] === 'P3') {
                data.push({
                    time: time,
                    description: 'Project is started',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/box.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'P4') {
                data.push({
                    time: time,
                    description: 'Project is closed',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/box.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'P5') {
                data.push({
                    time: time,
                    description: 'Project is restarted',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/box2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'M0') {
                data.push({
                    time: time,
                    description: 'Module ' + temp[i]['detail'] + ' is added',
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/plus.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'M1') {
                data.push({
                    time: time,
                    description: 'Module ' + temp[i]['detail'] + ' is edited',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/edit-2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'M2') {
                data.push({
                    time: time,
                    description: 'Module ' + temp[i]['detail'] + ' is deleted',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/trash.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'R0') {
                data.push({
                    time: time,
                    description: 'Requirement ' + temp[i]['detail'].split('_')[0] + ' is added for ' + temp[i]['detail'].split('_')[1] + ' module',
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/plus.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'R1') {
                data.push({
                    time: time,
                    description: 'Requirement ' + temp[i]['detail'].split('_')[0] + ' from ' + temp[i]['detail'].split('_')[1] + ' module is edited',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/edit-2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'R2') {
                data.push({
                    time: time,
                    description: 'Requirement ' + temp[i]['detail'].split('_')[0] + ' from ' + temp[i]['detail'].split('_')[1] + ' module is deleted',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/trash.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'R3') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' requirement is finished',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/check.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'R4') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' requirement is back to progress',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/x.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'I0') {
                data.push({
                    time: time,
                    description: temp[i]['detail'].split('_')[0] + ' from ' + temp[i]['detail'].split('_')[1] + ' division is invited to this project',
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/user-plus.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'I1') {
                data.push({
                    time: time,
                    description: 'Invitation for ' + temp[i]['detail'].split('_')[0] + ' from ' + temp[i]['detail'].split('_')[1] + ' division is canceled',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/user-minus.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'I2') {
                data.push({
                    time: time,
                    description: temp[i]['detail'].split('_')[0] + ' from ' + temp[i]['detail'].split('_')[1] + ' division accepted the invitation',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/user-check.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'I3') {
                data.push({
                    time: time,
                    description: temp[i]['detail'].split('_')[0] + ' from the ' + temp[i]['detail'].split('_')[1] + ' division is kicked',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/user-x.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'S0') {
                data.push({
                    time: time,
                    description: temp[i]['detail'].split('_')[0] + ' issue from ' + temp[i]['detail'].split('_')[1] + ' requirement of ' + temp[i]['detail'].split('_')[2] + ' module is added by ' + temp[i]['detail'].split('_')[3],
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/alert-circle.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'S1') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' issue is edited',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/alert-circle2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'S2') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' issue is resolved',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/alert-circle3.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'S3') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' issue is back to unsolved',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/alert-circle4.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'S4') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' issue is deleted',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/alert-circle4.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'B0') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' is added to backlog',
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/clipboard.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'B1') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' is deleted from backlog',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/clipboard2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'N0') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' sprint is added',
                    lineColor: '#1E88F5',
                    icon: require('../../../assets/image/ActivityIcon/briefcase.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'N1') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' sprint is edited',
                    lineColor: '#FF8C00',
                    icon: require('../../../assets/image/ActivityIcon/briefcase2.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'N2') {
                data.push({
                    time: time,
                    description: temp[i]['detail'] + ' sprint is deleted',
                    lineColor: '#CD0000',
                    icon: require('../../../assets/image/ActivityIcon/briefcase3.png'),
                    title: title
                })
            } else if (temp[i]['code'] === 'N3') {
                data.push({
                    time: time,
                    description: temp[i]['detail'].split('_')[0] + ' sprint is started for ' + temp[i]['detail'].split('_')[1] + ' weeks',
                    lineColor: '#007944',
                    icon: require('../../../assets/image/ActivityIcon/briefcase4.png'),
                    title: title
                })
            }
        }
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginLeft: 10, fontWeight: '700', fontSize: 14, color: 'grey' }}>Activity</Text>
                <Timeline
                    data={data}
                    lineColor='rgb(45,156,219)'
                    timeContainerStyle={{ minWidth: 52, marginLeft: 5 }}
                    timeStyle={{ textAlign: 'center', backgroundColor: '#4c669f', color: 'white', padding: 5, borderRadius: 13 }}
                    descriptionStyle={{ color: 'gray' }}
                    iconStyle={{ borderColor: '#4c669f' }}
                    circleColor='white'
                    circleSize={20}
                    options={{
                        style: { paddingTop: 5 }
                    }}
                    innerCircle={'icon'}
                    //separator={true}
                    renderDetail={this.renderDetail}

                />
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
    MiniIcon: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '100'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 30,
        marginRight: 20,
        borderRadius: 5,

    },
    textDescription: {
        marginLeft: 5,
        color: 'white',
        padding: 5,
        fontSize: 14
    },
    title: {
        fontSize: 11,
        color: 'gray'
    },
    timeContainer: {
        marginLeft: 5
    }
});