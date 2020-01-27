import React, { Component } from 'react'
import { View,  StyleSheet,} from 'react-native';
import { Text,  Accordion, Button, Container } from 'native-base';
import { createApolloFetch } from 'apollo-fetch'
export default class OverviewContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataOverview: [],
            name: '',
            client: '',
            start: '',
            end: '',
            status: '',
            problem: '',
            goal: '',
            objective: '',
            success: '',
            obstacle: '',
        }

    }
    fetch = createApolloFetch({ uri: this.props.uri });
    UNSAFE_componentWillReceiveProps(props) {
        var temp = []
        var datas = []
        temp = props.dataOverview
        var client_id
        var client_name
        var code
        var name
        var status
        var start
        var end
        var problem
        var goal
        var objective
        var success
        var obstacle
        var start_text
        var end_text
        temp.forEach(function (item) {
            start = new Date(item.start)
            end = new Date(item.end)
            start_text = ('0' + start.getDate()).slice(-2) + '-' + ('0' + (start.getMonth() + 1)).slice(-2) + '-' + start.getFullYear()
            end_text = ('0' + end.getDate()).slice(-2) + '-' + ('0' + (end.getMonth() + 1)).slice(-2) + '-' + end.getFullYear()
            client_id = item.client_id
            client_name = item.client_name
            code = item.code
            name = item.name
            status = item.status
            start = start_text
            end = end_text
            problem = item.problem
            goal = item.goal
            objective = item.objective
            success = item.success
            obstacle = item.obstacle
        })
        this.setState({
            id: this.props._id,
            name: name,
            client: client_name,
            start: start_text,
            end: end_text,
            status: status,
            problem: problem,
            goal: goal,
            objective: objective,
            success: success,
            obstacle: obstacle,
        })
        this.setState({
            dataOverview: [...this.state.dataOverview, {
                goal: goal,
                objective: objective,
                success: success,
                obstacle: obstacle,
                problem: problem,
            }],
        })
    }

    updateProject(problem, goal, objective, success, obstacle) {
        var data = []
        this.fetch({
            query: `
        mutation {
          project_update(
            _id:"`+ this.props.navigation.getParam('_id') + `",
            problem:"`+ problem + `",
            goal:"`+ goal + `",
            objective:"`+ objective + `",
            success:"`+ success + `",
            obstacle:"`+ obstacle + `"
          ){_id}
        }`
        })
        let activity_id = this.props.RDS(32, 'aA')
        let activity_code = 'P1'
        let activity_date = new Date()
        this.props.activity(activity_id, activity_code, '', activity_date)
        data.push({
            problem: problem,
            goal: goal,
            objective: objective,
            success: success,
            obstacle: obstacle,
        })
        this.setState({
            problem: problem,
            goal: goal,
            objective: objective,
            success: success,
            obstacle: obstacle,
            dataOverview: data
        })
    }
    /*push() {
        var temp = []
        var datas = []
        temp = this.props.dataOverview
        var client_id
        var client_name
        var code
        var name
        var status
        var start
        var end
        var problem
        var goal
        var objective
        var success
        var obstacle
        var start_text
        var end_text
        temp.forEach(function (item) {
            start = new Date(item.start)
            end = new Date(item.end)
            start_text = ('0' + start.getDate()).slice(-2) + '-' + ('0' + (start.getMonth() + 1)).slice(-2) + '-' + start.getFullYear()
            end_text = ('0' + end.getDate()).slice(-2) + '-' + ('0' + (end.getMonth() + 1)).slice(-2) + '-' + end.getFullYear()
            datas.push({
                client_id: item.client_id,
                client_name: item.client_name,
                code: item.code,
                name: item.name,
                status: item.status,
                start: start_text,
                end: end_text,
                problem: item.problem,
                goal: item.goal,
                objective: item.objective,
                success: item.success,
                obstacle: item.obstacle
            })
            client_id = item.client_id
            client_name = item.client_name
            code = item.code
            name = item.name
            status = item.status
            start = start_text
            end = end_text
            problem = item.problem
            goal = item.goal
            objective = item.objective
            success = item.success
            obstacle = item.obstacle
        })
       
        this.fetch({
            query: `{project(_id:"` + this.props._id + `") {
            code,
            name,
            status,
            start,
            end,
            problem,
            goal,
            objective,
            success,
            obstacle,
            client {
              name
            }
          }
        }`
        }).then(response => {
            var data = []
            var dataOverview = []



             content.forEach(function (Item) {
                 data.push({
                     title: Item.title,
                     content: response.data.project[Item.sub]
                 })
             })
            this.setState({
                id: this.props._id,
                data: data,
                dataOverview: datas,
                name: name,
                client: client_name,
                start: start_text,
                end: end_text,
                status: status,
                problem: problem,
                goal: goal,
                objective: objective,
                success: success,
                obstacle: obstacle,
            })
            console.log(name)
        })
    }*/

    _contentOverview() {
        const { data, name, client, start, end, dataOverview, problem, goal, success, objective, obstacle } = this.state
        const content = [{ title: 'Problem', content: problem },
        { title: 'Goal', content: goal },
        { title: 'Objective', content: objective },
        { title: 'Success Criteria', content: success },
        { title: 'Assumptions, Risks, Obstacles', content: obstacle },
        ]
        return (
            <View >
                <Text style={styles.TitleText}>{name}</Text>
                <Text style={styles.Subtitle}>{client}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.Subtitle}>{start}</Text>
                    <Text style={styles.Subtitle}>{end}</Text>
                </View>
                <Accordion
                    dataArray={content}
                    headerStyle={{ borderBottomColor: '#D3D3D3', borderBottomWidth: 0.5, borderTopColor: '#D3D3D3', borderTopWidth: 0.5, }}
                    contentStyle={{ backgroundColor: "white" }}
                />
            </View>
        )
    }

    render() {

        return (
            <Container>
                <Container style={{ flex: 1 }}>
                    <Text style={{ marginLeft: 10, fontWeight: '700', fontSize: 14, color: 'grey' }}>Overview</Text>
                    {this._contentOverview()}
                </Container>
                {this.state.status === '0' &&
                    <View style={{ alignItems: 'center', }}>
                        <Button info style={{ elevation: 1, marginBottom: 40, backgroundColor: '#4c669f', borderRadius: 4 }}
                            onPress={() => this.props.navigation.navigate('UpdateProject', {
                                updateProject: this.updateProject.bind(this),
                                dataOverview: this.state.dataOverview,
                            })}>
                            <Text>Update Project</Text>
                        </Button>
                    </View>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginHorizontal: 20,
    },
    TitleText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 20,
    },
    Subtitle: {
        fontSize: 14,
        marginHorizontal: 20,
    },
    Separator: {
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        width: 400,
    }

});