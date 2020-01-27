import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import ClientContent from '../../components/content/client/AddClient'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather'
const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 0
export default class AddClientScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <View style={styles.container} >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#4c669f', '#3b5998', '#192f6a']} 
                    style={[styles.mainScreen, styles.upperScreen]}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, marginTop: 6, fontWeight: 'bold' }]} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Add Client</Text>
                </LinearGradient>
                <View style={[styles.mainScreen, { backgroundColor: 'white', marginHorizontal: 10 }]}>
                    <ClientContent navigation={this.props.navigation} />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
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
    },
    title: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
    },
    font: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',

    },
    form: {
        flex: 1,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    }
});
