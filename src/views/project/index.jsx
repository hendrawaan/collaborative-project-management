import { createStackNavigator } from 'react-navigation-stack';
import ProjectScreen from './MyProjectScreen'
import AddProjectScreen from './AddProjectScreen'
import DetailProjectScreen from './DetailProjectScreen'
import UpdateProjectScreen from './UpdateProjectScreen'
import EditProjectScreen from './EditProjectScreen'
import AddModuleScreen from './AddModuleScreen'
import AddRequirementScreen from './AddRequirementScreen'
import ScrumScreen from './ScrumScreen'
import IssuesScreen from './IssuesScreen'
import RequirementScreen from './RequirementScreen'
const DetailProjectStack = createStackNavigator(
    {
        DetailProject: {
            screen: DetailProjectScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        EditProject: {
            screen: EditProjectScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        UpdateProject: {
            screen: UpdateProjectScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        AddModule: {
            screen: AddModuleScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        AddRequirement: {
            screen: AddRequirementScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        Issues: {
            screen: IssuesScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        Scrum: {
            screen: ScrumScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        Requirement: {
            screen: RequirementScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        }
    });
const ProjectStack = createStackNavigator(
    {
        Project: {
            screen: ProjectScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        AddProject: {
            screen: AddProjectScreen,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
        DetailProjectStack: {
            screen: DetailProjectStack,
            navigationOptions: {
                header: null,
                drawerLockMode: 'locked-closed'
            }
        },
    });

ProjectStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export default ProjectStack;