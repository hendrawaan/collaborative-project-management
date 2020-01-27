import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './HomeScreen'
import ClientStack from '../client/index';
import UsersStack from '../users/index';
import ProjectStack from '../project/index'
import ProfileStack from '../profile/index'
import NotificationStack from '../notification/index'
const HomeStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            header: null
        }
    },
    ClientStack: {
        screen: ClientStack,
        navigationOptions: {
            header: null
        }
    },
    UsersStack: {
        screen: UsersStack,
        navigationOptions: {
            header: null
        }
    },
    ProjectStack: {
        screen: ProjectStack,
        navigationOptions: {
            header: null
        }
    },
    NotificationStack: {
        screen: NotificationStack,
        navigationOptions: {
            header: null
        }
    },
    ProfileStack: {
        screen: ProfileStack,
        navigationOptions: {
            header: null
        }
    }
});
HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};
export default HomeStack;