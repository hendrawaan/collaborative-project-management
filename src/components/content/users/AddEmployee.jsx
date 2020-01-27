import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Text, Content, Item, Input, Button, Picker, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import { StackActions } from 'react-navigation';
export default class AddEmployeeContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            employeeDivision: '',
            employeeName: '',
            employeeEmail: '',
            employeeContact: '',
            label: ''
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    async push() {
        const retrievedOrganization = await AsyncStorage.getItem('organization');
        const itemOrganization = JSON.parse(retrievedOrganization);
        this.setState({ organization: itemOrganization })
        var organization = this.state.organization
        this.fetch({
            query: `{
            organization(_id:"`+ organization + `") {
              division { _id, name
              }
            }
          }`}).then(response => {
                var temp = response.data.organization.division
                var data = []

                temp.forEach(function (item) {
                    data.push({
                        label: item.name,
                        value: item._id
                    })
                })
                this.setState({ data: data })
            })
    }
    pickerChange(index) {
        const { data } = this.state
        data.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: data[index].label,
                    employeeDivision: data[index].value
                })
            }
        })
    }

    addEmployee() {
        const { employeeContact, employeeEmail, employeeName, employeeDivision } = this.state
        const { params } = this.props.navigation.state
        params.function(employeeDivision, employeeName, employeeEmail, employeeContact)
        Toast.show({
            text: 'Employee added. Your password is: 1234 ',
            buttonText: 'Undo',
            duration: 3000,
            textStyle: { color: 'green' }
        })
        this.props.navigation.dispatch(StackActions.popToTop());
    }
    _content() {
        const { employeeContact, employeeEmail, employeeName, employeeDivision, data } = this.state
        const addEmployeeValidation = () => {
            if (employeeContact === '' || employeeEmail === '' || employeeName === '' || employeeDivision === '') {
                Toast.show({
                    text: 'Form cannot be empty',
                    buttonText: 'Undo',
                    duration: 3000,
                    textStyle: { color: 'yellow' }
                })
            } else {
                this.addEmployee()
            }
        }
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ employeeName: text })}
                        value={employeeName} />
                </Item>
                <Text style={styles.Subtitle}>Email</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ employeeEmail: text })}
                        value={employeeEmail} />
                </Item>
                <Text style={styles.Subtitle}>Mobile Number</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ employeeContact: text })}
                        value={employeeContact} />
                </Item>
                <Text style={styles.Subtitle}>Division</Text>
                <Item style={styles.Input} picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={employeeDivision}
                        onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                    >
                        {
                            data.map((v, index) => {
                                return <Picker.Item label={v.label} value={v.value} key={index} />
                            })
                        }
                    </Picker>
                </Item>
                <Button info style={styles.button}
                    onPress={() => addEmployeeValidation()}>
                    <Text style={{ textAlign: 'center' }}>Add</Text>
                </Button>
            </Content>
        )
    }
    render() {
        const { params } = this.props.navigation.state
        return (
            <View style={{ flex: 1 }}>
                {params.header('Add Employee')}
                {this._content()}
            </View>
        );
    }
}
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
        marginTop: 20
    },
    button: {
        backgroundColor: '#4c669f', width: 70,
        alignSelf: 'center', marginVertical: 30, borderRadius: 4
    }
});