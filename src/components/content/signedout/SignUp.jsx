import React from "react";
import { View, StyleSheet } from "react-native";
import { Content, Item, Form, Label, Button, Text, Input, Icon } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import AwesomeAlert from 'react-native-awesome-alerts';
import md5 from 'md5';
export default class SignUpScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      retypePassword: '',
      organization: '',
      contact: '',
      progress: false,
      secureTextEntry: true,
      secureTextEntry2: true,
      showAlert: false,
      cancel: true
    }
  }
  componentWillUnmount() {
    this.hideAlert();
  }
  fetch = createApolloFetch({ uri: 'https://cpmserver.herokuapp.com/graphql' });
  randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
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
    if (this.state.name === '' || this.state.email === '' || this.state.password === '' || this.state.retypePassword === '' || this.state.organization === '' || this.state.contact === '') {
      { this.showAlert('Register Failed', 'Field cannot be empty') }
    } else {
      return true;
    }
  }
  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }
  signUp() {
    var pass = md5(this.state.password);
    var rePass = md5(this.state.retypePassword);
    var name = this.state.name
    var email = this.state.email
    var contact = this.state.contact
    var organization = this.state.organization
    if (this.validation() === true) {
      this.setState({
        showAlert: true,
        progress: true,
        messageAlert: 'Loading',
        cancel: false
      })
      var _id_employee = this.randomString(32, 'aA');
      var _id_organization = this.randomString(32, 'aA')
      if (pass == rePass) {
        this.fetch({
          query: '{employee(email:"' + email + '"){name}}'
        }).then(response => {
          if (response.data.employee === null) {
            this.fetch({
              query: `mutation{
                employee_add(
                  _id:"`+ _id_employee + `",
                  password:"`+ pass + `",
                  organization:"`+ _id_organization + `",
                  division:"",
                  name:"`+ name + `",
                  email:"`+ email + `",
                  contact:"`+ contact + `"
                ){_id}
              }`
            }).then(() => {
              this.fetch({
                query: `mutation{
                organization_add(
                  _id:"`+ _id_organization + `",
                  name:"`+ organization + `"
                ){_id}
              }` })
              this.fetch({
                query: `mutation{
                rule_add(
                  organization:"`+ _id_organization + `",
                  leader:"`+ _id_employee + `"
                ){organization{_id}}
              }` })
              this.setState({
                showAlert: false,
              })
              this.storeItem('user', _id_employee);
              this.storeItem('organization', _id_organization);
              this.storeItem('leader', '1');
              this._signInAsync()
            })
          } else {
            this.setState({
              showAlert: true,
              cancel: true,
              progress: false,
              titleAlert: 'Register Failed',
              messageAlert: 'Email has been used'
            })
          }
        })
      } else {
        this.setState({
          showAlert: true,
          cancel: true,
          progress: false,
          titleAlert: 'Register Failed',
          messageAlert: 'password and confirm password not match'
        })
      }
    }
  }
  render() {
    return (
      <Content style={styles.contentLogin}>
        <View style={styles.center}>
          <Text style={styles.font1}>Create New Account</Text>
        </View>
        <Form style={styles.formLogin}>
          <Item floatingLabel>
            <Label>
              <Text style={styles.st_inputfnt}>Your Name</Text>
            </Label>
            <Input
              style={styles.st_inputfnt}
              onChangeText={(text) => this.setState({ name: text })}
              autoCapitalize='words'
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <Text style={styles.st_inputfnt}>Your Organization</Text>
            </Label>
            <Input
              style={styles.st_inputfnt}
              onChangeText={(text) => this.setState({ organization: text })}
              autoCapitalize='words'
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <Text style={styles.st_inputfnt}>Mobile Number</Text>
            </Label>
            <Input
              style={styles.st_inputfnt}
              onChangeText={(text) => this.setState({ contact: text })}
              keyboardType='numeric'
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <Text style={styles.st_inputfnt}>Email</Text>
            </Label>
            <Input
              style={styles.st_inputfnt}
              onChangeText={(text) => this.setState({ email: text })}
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
              onChangeText={(text) => this.setState({ password: text })}
              autoCapitalize='none'
            />
            {this.renderIcon(styles.icon, this.state.secureTextEntry)}
          </Item>
          <Item floatingLabel>
            <Label>
              <Text style={styles.st_inputfnt}>Confirm Password</Text>
            </Label>
            <Input
              style={styles.st_inputfnt}
              secureTextEntry={this.state.secureTextEntry2}
              onChangeText={(text) => this.setState({ retypePassword: text })}
              autoCapitalize='none'
            />
            {this.renderIcon(styles.icon, this.state.secureTextEntry2)}
          </Item>
        </Form>
        <Button block info style={styles.footerBottom} onPress={() => this.signUp()}>
          <Text>Create Account</Text>
        </Button>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={this.state.progress}
          style={{ progressSize: 50 }}
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

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', this.state.email);
    this.props.navigation.navigate('App');
  };
  renderIcon = (style, state) => {
    const iconName = state ? 'eye-off' : 'eye';
    return (
      <Icon {...style} name={iconName} onPress={() => this.onIconPress(state)} style={styles.icon} />
    );
  };
  onIconPress = (state) => {
    const secureTextEntry = !state;
    const secureTextEntry2 = !state;
    this.setState({ secureTextEntry, secureTextEntry2 });
  };
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
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 30,
    backgroundColor: 'transparent'
  },
  contentLogin: {
    marginTop: 10,
  },
  images: {

    width: 220,
    height: 150,
    borderRadius: 20,
  },
  font1: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottomSignUp: {
    marginTop: 56,
    alignItems: 'center',
    color: '#5bc0de'
  },
  st_signup: {
    color: 'white',
    fontWeight: '500',
  },
  st_inputfnt: {
    color: 'white',
  }
});
