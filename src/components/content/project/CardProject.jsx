import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native';
import { Left, Right, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';

import DataClient from '../../../data/Client';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });

const parent = [];
const days = (date) => {
    date = date.split("/")
    date = new Date(date[2], date[1] - 1, date[0])
    var round = Math.round((date - new Date()) / 86400000);
    if (round > 0)
        return Math.round((date - new Date()) / 86400000);
    else
        return 0;
}
const row = ['START DATE', 'NUMBER']
const query = ''
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const push = () => {
    parent.forEach(function (item_p) {
        var client = DataClient.filter(function (item_c) {
            return item_p.client === item_c.id
        })
        data.push({
            id: item_p.id,
            project: item_p.name,
            client: client[0]['name'],
            end: item_p.end,
            start: item_p.start,
            number: item_p.number
        })

    })
}

const header = () => {
    return (
        <CardItem header style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        </CardItem>
    )
}
const footer = () => {
    return (
        <CardItem footer style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        </CardItem>
    )
}
const Organization = 'RHzxwzhRAKCKIWlCaVFdspyFaffqJ'
export default class CardProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null
        }

        data.length = 0;
        parent.length = 0;
        this.props.data.forEach(function (item) {
            parent.push(item)
        })

        push();
        this.getData();
        this.push()
        console.log(AsyncStorage.getItem('organization'))

    }
    storeData() {
        let obj = 'RHzxwzhRAKCKIWlCaVFdspyFaffqJ'
        AsyncStorage.setItem('organization', obj)
    }

    getData = async () => {
        try {
            let value = await AsyncStorage.getItem('organization')
            this.setState({ nilai: value })
            if (value !== null) {
                //console.log(value)
                return value;
            } e
        } catch (e) {
            // error reading value
        }
    }
    push() {
        fetch({
            query: '{organization(_id: "smOuQPjvqoGBaWwtjcCIUaLVnkqEvhWO"){name}}'
        }).then(result => {

        }).catch((error) => {
            return error
        })
    }
    body = (index) => {
        return (
            <CardItem style={styles.Card}>
                <View >
                    <Text style={styles.days}>{days(data[index]['start'])}</Text>
                    <Text style={styles.remaining}>Days {"\n"}remaining</Text>
                </View>
                <View>
                    <View
                        style={{
                            borderLeftWidth: 1,
                            borderLeftColor: '#D3D3D3',
                            marginHorizontal: 7,
                            height: 100,
                        }}
                    />
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', flex: 1, }}>
                    <Text style={styles.Title} maxLength={33} ellipsizeMode='tail' numberOfLines={1}>{data[index]['project']}</Text>
                    <View style={{ flexDirection: 'row', marginTop: -3 }}>
                        <Icon name='user' style={styles.MiniIcon}></Icon>
                        <Text style={styles.Subtitle} maxLength={25} ellipsizeMode='tail' numberOfLines={1}>{data[index]['client']}  {this.state.nilai}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 15, borderTopColor: '#D3D3D3', borderTopWidth: 1 }}>
                        {row.map((rows) =>
                            <Text key={rows} style={styles.row}>    {rows}                </Text>)}
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, }}>
                        <Text style={{ fontSize: 12, color: 'grey', fontWeight: 'bold' }}>  {data[index]['start']}</Text>
                        <Text style={{ fontSize: 12, color: 'grey', fontWeight: 'bold' }}>             {data[index]['number']}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity style={{ top: -40 }}>
                        <Icon name='more-vertical' style={{ fontSize: 18, }} />
                    </TouchableOpacity>
                </View>
            </CardItem>
        )
    }
    render() {
        return (
            <View>
                {parent.map((datas, index) =>
                    <TouchableHighlight key={index} onPress={() => this.props.navigation.navigate({ routeName: 'DetailPreparing', key: 'DetailPreparing', params: { id: parent[index]['id'], client: parent[index]['client'] } })}>
                        <Card
                            body={this.body(index)}
                            bordered={true}
                        />
                    </TouchableHighlight>)}

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
        fontSize: 16,
        color: 'grey'
    },
    Title: {
        fontWeight: 'bold',
        marginVertical: 5,
        marginTop: -5,
        fontSize: 18,
        width: 250
    },
    Card: {
        borderRadius: 8,
        borderLeftColor: getRandomColor(),
        borderLeftWidth: 10,
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
    }
});