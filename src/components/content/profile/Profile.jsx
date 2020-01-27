import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Text, Right, CardItem, Content, Item, Input, Badge, Tab, Tabs, Button, } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import Card from '../../layout/Card';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
const uri = 'https://skripsi-cpm-server.herokuapp.com/graphql'
const fetch = createApolloFetch({ uri });
const setting = [{ icon: 'edit-3', text: 'Edit Project' },
{ icon: 'play', text: 'Start Project' },
{ icon: 'trash', text: 'Delete Project' },
]
export default class ProfileContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            nama: '',
            nim: '',
            alamat: '',
            fakultas: 'Ilmu Komputer'
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    async push() {
        const retrievedUser = await AsyncStorage.getItem('user')
        const itemUser = JSON.parse(retrievedUser);
        this.setState({ user: itemUser })
        var user = this.state.user
        this.fetch({
            query: `{
            employee(_id:"`+ user + `") {
              name, contact, email, password,
              organization { name },
              division { name }
            }
          }`
        }).then(result => {
            var data = result.data.employee
            var division = data.division
            if (division.length === 0) { division = '' }
            else { division = '(' + division[0]['name'] + ')' }
            this.setState({
                name: data.name,
                email: data.email,
                contact: data.contact,
                organization: data.organization[0].name,
                division: division,
                password: data.password,
                readOnly: false,
                disabled: false,
            })
        })
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
    _content() {
        const { nama, nim, alamat, fakultas } = this.state
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Nama</Text>
                <Input
                    style={styles.Input}
                    value={nama}
                    onChangeText={(nama) => this.setState({ nama: '' })} />
                <Text style={styles.Subtitle}>NIM</Text>
                <Input
                    style={styles.Input}
                    value={nim}
                    onChangeText={(nama) => this.setState({ nim: '' })} />
                <Text style={styles.Subtitle}>Alamat</Text>
                <Input
                    style={styles.Input}
                    value={alamat}
                    onChangeText={(nama) => this.setState({ alamat: '' })} />
                <Text style={styles.Subtitle}>Fakultas</Text>
                <Input
                    style={styles.Input}
                    value={fakultas}
                    onChangeText={(nama) => this.setState({ fakultas: '' })} />
                <Button info style={{ width: 200, alignSelf: 'center', backgroundColor: 'blue' }}>
                    <Text style={{ textAlign: 'center' }}>UBAH</Text>
                </Button>
            </Content>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._header('Edit Profile')}
                
            </View>
        );
    }
}
//{this._content()}
const styles = StyleSheet.create({
    font: {
        color: 'white'
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