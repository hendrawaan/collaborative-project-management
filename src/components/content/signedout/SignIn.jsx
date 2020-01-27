import React from "react";
import { View, StyleSheet, TouchableOpacity, YellowBox } from "react-native";
import { Content, Item, Form, Thumbnail, Label, Button, Text, Input, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import AwesomeAlert from 'react-native-awesome-alerts';
import md5 from 'md5';

YellowBox.ignoreWarnings([
    "Warning: Can't ",
]);
export default class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputEmail: '',
            inputPassword: '',
            secureTextEntry: true,
            showAlert: false,
            titleAlert: '',
            messageAlert: '',
            cancel: true,
            progress: false
        }

    }
    fetch = createApolloFetch({ uri: 'https://cpmserver.herokuapp.com/graphql' });
    UNSAFE_componentWillUnmount() {
        this.setState({
            inputEmail: '',
            inputPassword: '',
            secureTextEntry: true,
            showAlert: false,
            titleAlert: '',
            messageAlert: '',
            cancel: true,
            progress: false
        })
        this._signInAsync();
        this.storeItem();
        this.showAlert();
        this.hideAlert();
    }
    async storeItem(key, item) {
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    showAlert = (title, message) => {
        this.setState({
            showAlert: true,
            titleAlert: title,
            messageAlert: message
        });
    };
    hideAlert = () => {
        this.setState({
            showAlert: false,
            titleAlert: '',
            messageAlert: ''
        });
    }
    validation() {
        if (this.state.inputEmail === '') {
            { this.showAlert('Login Failed', 'Email cannot be empty') }
        } else if (this.state.inputPassword === '') {
            { this.showAlert('Login Failed', 'Password cannot be empty') }
        } else {
            return true;
        }
    }
    login() {
        var pass = md5(this.state.inputPassword);
        var email = this.state.inputEmail
        if (this.validation() === true) {
            this.setState({
                showAlert: true,
                progress: true,
                messageAlert: 'Loading',
                cancel: false
            })
            this.fetch({
                query: `{
                    employee (email:"`+ email + `") {
                      _id, password,
                      organization { _id, leader { leader { _id } } }
                    }
                  }`
            }).then(response => {
                if (response.data.employee === null) {
                    this.showAlert('Login Failed', 'Email has not registered')
                } else {
                    if (response.data.employee.password === pass) {
                        this.storeItem('user', response.data.employee._id)
                        this.storeItem('organization', response.data.employee.organization[0]['_id'])
                        if (response.data.employee.organization[0]['leader'][0]['leader'][0]['_id'] === response.data.employee._id) {
                            this.storeItem('leader', '1');
                        } else { this.storeItem('leader', '0'); }
                        this.setState({
                            showAlert: false
                        })
                        this._signInAsync();
                    } else {
                        this.setState({
                            showAlert: true,
                            cancel: true,
                            progress: false,
                            titleAlert: 'Login Failed',
                            messageAlert: 'Wrong Password'
                        })
                    }
                }
            })
        }
    }
    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', this.state.inputEmail);
        this.props.navigation.navigate('App');
    };
    renderIcon = (style) => {
        const iconName = this.state.secureTextEntry ? 'eye-off' : 'eye';
        return (
            <Icon {...style} name={iconName} onPress={() => this.onIconPress()} style={styles.icon} />
        );
    };
    onIconPress = () => {
        const secureTextEntry = !this.state.secureTextEntry;
        this.setState({ secureTextEntry });
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Content style={styles.contentLogin}>
                <View style={styles.center}>
                    <Thumbnail square small source={require('../../../assets/image/logo.png')} style={styles.images} />
                    <Text style={styles.font1}>Collaborative Project Management</Text>
                </View>
                <Form style={styles.formLogin}>
                    <Item floatingLabel>
                        <Label>
                            <Text style={styles.st_inputfnt}>Email</Text>
                        </Label>
                        <Input
                            style={styles.st_inputfnt}
                            onChangeText={(text) => this.setState({ inputEmail: text })}
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>
                            <Text style={styles.st_inputfnt}>Password</Text>
                        </Label>
                        <Input
                            style={styles.st_inputfnt}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(text) => this.setState({ inputPassword: text })}
                            autoCapitalize='none'
                        />
                        {this.renderIcon(styles.icon)}
                    </Item>
                </Form>
                <Button block info style={styles.footerBottom} onPress={() => this.login()}>
                    <Text>Sign In</Text>
                </Button>
                <View style={styles.footerBottomSignUp}>
                    <Text style={styles.st_signup}>
                        Don't have an account?
                         </Text>
                    <TouchableOpacity onPress={() => navigate('SignUp')}>
                        <Text style={[styles.st_signup, { color: '#5bc0de', fontSize: 13 }]}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={this.state.progress}
                    title={this.state.titleAlert}
                    message={this.state.messageAlert}
                    closeOnTouchOutside={this.state.cancel}
                    closeOnHardwareBackPress={this.state.cancel}
                    showCancelButton={this.state.cancel}
                    cancelText="Dismiss"
                    onCancelPressed={() => { this.hideAlert() }}
                />
            </Content>
        );
    }


}
const styles = StyleSheet.create({
    icon: {
        color: 'white',
    },
    footerBottom: {
        marginTop: 26,
        paddingTop: 10,
        marginLeft: 16,
        marginRight: 16,
    },
    formLogin: {
        marginTop: 30,
        paddingLeft: 10,
        paddingRight: 30,
        backgroundColor: 'transparent'
    },
    contentLogin: {
        marginTop: 10,
    },
    images: {
        marginTop: 80,
        width: 220,
        height: 150,
        borderRadius: 20,
    },
    font1: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerBottomSignUp: {
        marginTop: 56,
        alignItems: 'center',
    },
    st_signup: {
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    st_inputfnt: {
        color: 'white',
    }
});
