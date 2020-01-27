import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'native-base'
import Icon from 'react-native-vector-icons/Feather'
const CardMenu = [
    { text: 'Project', iconName: 'box', color1: '#6441a5', color2: '#2a0845', navigate: 'ProjectStack' },
    { text: 'Client', iconName: 'user-check', color1: '#136a8a', color2: '#267871', navigate: 'ClientStack' },
    { text: 'Users', iconName: 'users', color1: '#ffb347', color2: '#ffcc33', navigate: 'UsersStack' },

]
export default class HomeContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
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
    header() {
        return (
            <View>

                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    backgroundColor="#4c669f"
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.LinearHeader}>
                    <View style={styles.IconHeader}>
                        <TouchableOpacity style={styles.RoundIconHeader} onPress={() => this.props.navigation.navigate('ProfileStack', { uri: 'https://cpmserver.herokuapp.com/graphql' })}>
                            <Icon name='user' size={30} color="white" style={{ elevation: 1 }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.RoundIconHeader} onPress={() => this.props.navigation.navigate('NotificationStack', { uri: 'https://cpmserver.herokuapp.com/graphql' })}>
                            <Icon name='bell' size={30} color="white" style={{ elevation: 1 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.TitleHeader}>HOME</Text>
                </LinearGradient>
            </View>
        )
    }
    menu() {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 25, justifyContent: 'space-between', marginVertical: 10 }}>
                {CardMenu.map((datas, index) =>
                    <TouchableOpacity style={styles.CardMenu} key={index} onPress={() => this.props.navigation.navigate(datas.navigate, {
                        uri: 'https://cpmserver.herokuapp.com/graphql',
                        RDS: this.randomString.bind(this)
                    })}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 0.5, y: 1.0 }}
                            colors={[datas.color1, datas.color2]} style={styles.RoundMenu}>
                            <Icon name={datas.iconName} size={25} color="white" />
                        </LinearGradient>
                        <Text>{datas.text}</Text>
                    </TouchableOpacity>
                )}
            </View>)
    }
    render() {
        return (
            <View>
                {this.header()}
                {this.menu()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    TitleHeader: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    LinearHeader: {
        height: 140,
        maxHeight: 150,
    },
    CardMenu: {

        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 100, height: 100 },
        shadowOpacity: 10,
        shadowRadius: 10,
    },
    RoundMenu: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,
        elevation: 1
    },
    IconHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 10
    },
    RoundIconHeader: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
        resizeMode: 'cover'
    }
})