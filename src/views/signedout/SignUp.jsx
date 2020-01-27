import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import SignUpForm from '../../components/content/signedout/SignUp'
export default class login extends Component {
    render() {

        return (
            <View style={styles.container}>
                <Image style={styles.bgimage} source={require('../../assets/image/backgroundsignedout.jpg')} />
                <View style={styles.loginForm}>
                    <SignUpForm navigation={this.props.navigation} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16a085',
    },
    loginForm: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
    },
    font: {
        fontSize: 25,
        color: 'white',
        marginTop: 25,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    bgimage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
