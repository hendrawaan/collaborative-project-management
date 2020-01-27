import React from 'react'
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import { Text, Content, Button, Textarea, Form, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import { StackActions } from 'react-navigation';
export default class UpdateProjectContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            problem: '',
            goal: '',
            objective: '',
            success: '',
            obstacle: ''
        }
    }

    componentDidMount() {
        var temp = this.props.navigation.getParam('dataOverview')
        var goal = ''; var problem = ''; var objective = ''; var success = ''; var obstacle = ''
        temp.forEach(function (item) {
            goal = item.goal
            problem = item.problem
            objective = item.objective
            success = item.success
            obstacle = item.obstacle
        })
        this.setState({
            goal: goal,
            problem: problem,
            objective: objective,
            success: success,
            obstacle: obstacle
        })
    }

    updateProjectHandler() {
        const { problem, goal, objective, success, obstacle } = this.state
        const { params } = this.props.navigation.state
        params.updateProject(problem, goal, objective, success, obstacle)
        Toast.show({
            text: 'Project Updated',
            buttonText: 'Undo',
            duration: 3000,
            textStyle: { color: 'green' }
        })
        this.props.navigation.dispatch(StackActions.popToTop());
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
        const { problem, goal, objective, success, obstacle } = this.state
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <View style={[styles.form, { height: 250 }]}>
                    <Text style={styles.Subtitle}>Problem</Text>
                    <Form style={styles.Input} regular>
                        <Textarea
                            style={{ borderWidth: 0, height: 200 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ problem: text })}
                            value={problem}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 250 }]}>
                    <Text style={styles.Subtitle}>Goal</Text>
                    <Form style={styles.Input} regular>
                        <Textarea
                            style={{ borderWidth: 0, height: 200, }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ goal: text })}
                            value={goal}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 250 }]}>
                    <Text style={styles.Subtitle}>Objective</Text>
                    <Form style={styles.Input} regular>
                        <Textarea
                            style={{ borderWidth: 0, height: 200 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ objective: text })}
                            value={objective}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 250 }]}>
                    <Text style={styles.Subtitle}>Success Criteria</Text>
                    <Form style={styles.Input} regular>
                        <Textarea
                            style={{ borderWidth: 0, height: 200 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ success: text })}
                            value={success}
                            multiline={true}
                        />
                    </Form>
                </View>
                <View style={[styles.form, { height: 250 }]}>
                    <Text style={styles.Subtitle}>Assumptions, Risks, Obstacles</Text>
                    <Form style={styles.Input} regular>
                        <Textarea
                            style={{ borderWidth: 0, height: 200 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ obstacle: text })}
                            value={obstacle}
                            multiline={true}
                        />
                    </Form>
                </View>
            </Content>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._header('Update Project')}
                {this._content()}
                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => this.updateProjectHandler()}>
                    <Text style={{ textAlign: 'center' }}>Save</Text>
                </Button>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    font: {
        color: 'white'
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
    },
    footerBottom: {
        width: 170,
        alignSelf: 'center',
        borderRadius: 4
    }
});