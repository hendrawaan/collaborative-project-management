import React, { Component, useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar, SafeAreaView, Button, YellowBox } from 'react-native';
import { Content, Item, Input, Badge, Tab, Tabs, Text, Picker, Textarea, Form, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import { StackActions } from 'react-navigation';
import Wizard from "react-native-wizard"
import DatePicker from 'react-native-datepicker';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
YellowBox.ignoreWarnings([
    'Warning: DatePickerAndroid ',
]);
export default class AddProjectContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isFirstStep: true,
            isLastStep: false,
            currentStep: 0,
            code: '',
            name: '',
            client: '',
            label: '',
            start: new Date(),
            end: new Date(),
            min: new Date(),
            problem: '',
            goal: '',
            objective: '',
            success: '',
            obstacle: '',
            organization: '',
            user: '',
            errors: false
        }
        this.push();
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    async push() {

        const retrievedOrganization = await AsyncStorage.getItem('organization')
        const itemOrganization = JSON.parse(retrievedOrganization);
        this.setState({ organization: itemOrganization })
        var organization = this.state.organization
        this.fetch({
            query: `{
                organization(_id:"`+ organization + `") {
                  client {
                    _id,
                    name
                  }
                }
              }`
        }).then(response => {

            var temp = response.data.organization.client
            var data = []
            temp.forEach(function (item) {
                data.push({
                    value: item._id,
                    label: item.name
                })
            })
            this.setState({
                data: data
            })
        })
    }
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

    insert_replace(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '\\n')
    }
    async AddProjectHandler() {
        const { code, name, client, label, start, end, goal, problem, success, objective, obstacle } = this.state
        var start_date = new Date(start); var end_date = new Date(end)
        const retrievedOrganization = await AsyncStorage.getItem('organization');
        const retrievedUser = await AsyncStorage.getItem('user')
        const itemOrganization = JSON.parse(retrievedOrganization);
        const itemUser = JSON.parse(retrievedUser);
        this.setState({ organization: itemOrganization, user: itemUser })
        var user = this.state.user
        var organization = this.state.organization
        var _id = this.randomString(32, 'aA');
        fetch({
            query: `
         mutation {
           project_add(
             _id:"`+ _id + `",
             organization:"`+ organization + `",
             employee:"`+ user + `",
             client:"`+ client + `",
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
        fetch({
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
        this.props.navigation.dispatch(StackActions.popToTop());
    }


    pickerChange(index) {
        const { data } = this.state
        data.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: data[index].label,
                    client: data[index].value + '_' + data[index].label
                })
            }
        })
    }
    _content_1() {

        return (
            <View style={[styles.form, { height: 400 }]}>
                <Text style={styles.Subtitle}>Code</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ code: text })}
                        value={this.state.code}
                    />
                </Item>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ name: text })}
                        value={this.state.name}
                    />
                </Item>
                <Text style={styles.Subtitle}>Client</Text>
                <Item style={styles.Input} picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.client}
                        onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                    >
                        {
                            this.state.data.map((v) => {
                                return <Picker.Item label={v.label} value={v.value + '_' + v.label} key={v.value} />
                            })
                        }
                    </Picker>
                </Item>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.Subtitle}>Start Date</Text>
                        <DatePicker
                            style={[styles.Input, { marginRight: 10 }]}
                            date={this.state.start} //initial date from state
                            mode="date" //The enum of date, datetime and time
                            placeholder="select date"
                            //format="DD-MM-YYYY"
                            minDate={this.state.min}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ start: date }) }}
                        />
                    </View>
                    <View>
                        <Text style={styles.Subtitle}>End Date</Text>
                        <DatePicker
                            style={[styles.Input, { marginLeft: 0, marginRight: 0 }]}
                            date={this.state.end} //initial date from state
                            mode="date" //The enum of date, datetime and time
                            placeholder="select date"
                            //format="DD-MM-YYYY"
                            minDate={this.state.min}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ end: date }) }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    _content_2() {
        return (
            <View>
                <View style={[styles.form, { height: 300 }]}>
                    <Text style={styles.Subtitle}>Problem</Text>
                    <Form style={styles.Input} regular >
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ problem: text })}
                            value={this.state.problem}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 300 }]}>
                    <Text style={styles.Subtitle}>Goal</Text>
                    <Form style={styles.Input} regular >
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ goal: text })}
                            value={this.state.goal}
                            multiline={true}
                        />
                    </Form>
                </View>
            </View>
        )
    }
    _content_3() {
        return (
            <View style={[styles.form, { height: 400 }]}>
                <Text style={styles.Subtitle}>Goal</Text>
                <Form style={styles.Input} regular >
                    <Textarea
                        style={{ borderWidth: 0 }}
                        rowSpan={10}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ goal: text })}
                        value={this.state.goal}
                        multiline={true}
                    />
                </Form>
            </View>)
    }
    _content_4() {
        return (
            <View>
                <View style={[styles.form, { height: 300 }]}>
                    <Text style={styles.Subtitle}>Objective</Text>
                    <Form style={styles.Input} regular >
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ objective: text })}
                            value={this.state.objective}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 300 }]}>
                    <Text style={styles.Subtitle}>Success Criteria</Text>
                    <Form style={styles.Input} regular >
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ success: text })}
                            value={this.state.success}
                            multiline={true}
                        />
                    </Form>
                </View>
            </View>)
    }
    _content_5() {
        return (
            <View style={[styles.form, { height: 400 }]}>
                <Text style={styles.Subtitle}>Success Criteria</Text>
                <Form style={styles.Input} regular >
                    <Textarea
                        style={{ borderWidth: 0 }}
                        rowSpan={10}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ success: text })}
                        value={this.state.success}
                        multiline={true}
                    />
                </Form>
            </View>)
    }
    _content_6() {
        return (
            <View style={[styles.form, { height: 300 }]}>
                <Text style={styles.Subtitle}>Assumptions, Risks, Obstacles</Text>
                <Form style={styles.Input} regular >
                    <Textarea
                        style={{ borderWidth: 0 }}
                        rowSpan={10}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ obstacle: text })}
                        value={this.state.obstacle}
                        multiline={true}
                    />
                </Form>
            </View>)
    }
    onSubmit = () => {
        const { client, code, name, start, end, problem, goal, objective, success, obstacle } = this.state
        const { params } = this.props.navigation.state
        params.function(client, code, name, start, end, problem, goal, objective, success, obstacle)
    }
    onNextStep = () => {
        const { client, start, end, code, name } = this.state

        if (client === '' || start === '' || end === '' || code === '' || name === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
            this.setState({ errors: true })
        } else {
            this.setState({ errors: false })
        }
    }
    _content() {
        const { errors } = this.state

        const step = [{
            label: 'Overview',
            content: this._content_1(),
        }, {
            label: 'Problem & Goal',
            content: this._content_2(),
        }, {
            label: 'Objective & Success Criteria',
            content: this._content_4(),
        }, {
            label: 'Assumptions, Risks, Obstacles',
            content: this._content_6(),
        }]

        return (
            <ProgressSteps activeLabelColor='#4c669f'
                completedProgressBarColor='#4c669f'
                completedStepIconColor='#4c669f'
                activeStepIconBorderColor='#4c669f'
                activeStepNumColor='#4c669f'
            >
                {step.map((val, index) =>
                    <ProgressStep label={val.label}
                        nextBtnTextStyle={styles.textButton}
                        //nextBtnStyle={styles.button}
                        previousBtnTextStyle={styles.textButton}
                        //previousBtnStyle={styles.button}
                        key={index}
                        onNext={this.onNextStep}
                        errors={errors}
                        onSubmit={this.onSubmit}>
                        <View style={{ alignItems: 'center' }}>
                            {val.content}
                        </View>
                    </ProgressStep>
                )}
            </ProgressSteps>
        )
    }


    render() {
        const { params } = this.props.navigation.state
        return (
            <Content style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    backgroundColor="#4c669f"
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                {params.header("Add Project")}
                <Content style={{ marginHorizontal: 5 }}>
                    {this._content()}
                </Content>
            </Content>
        );
    }
}
const styles = StyleSheet.create({


    font: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',

    },
    button: {
        backgroundColor: '#4c669f',
        borderRadius: 5
    },
    textButton: {
        color: '#4c669f'
    },
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        marginVertical: 10,
        flex: 1,

    },
    form: {

        backgroundColor: 'transparent',
        width: 350
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
    TextBox: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 4,
        borderColor: '#E8E8E8',
        height: 100
    }
});