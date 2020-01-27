import { createStackNavigator } from 'react-navigation-stack';
import UsersScreen from './UsersScreen'
import DivisionTab from '../../components/content/users/Division'
import EmployeeTab from '../../components/content/users/Employee'
import AddEmployeeScreen from './AddEmployeeScreen';
import AddDivisionScreen from './AddDivisionScreen';
import DetailEmployeeScreen from './DetailEmployeeScreen'
import DetailDivisionScreen from './DetailDivisionScreen'
const UsersStack = createStackNavigator({
   Users: {
        screen: UsersScreen,
        navigationOptions: {
            header: null
        }
    },
    Division: {
        screen: DivisionTab,
        navigationOptions: {
            header: null
        }
    },
    Employee: {
        screen: EmployeeTab,
        navigationOptions: {
            header: null
        }
    },
    AddEmployee: {
        screen: AddEmployeeScreen,
        navigationOptions: {
            header: null
        }
    },
    AddDivision: {
        screen: AddDivisionScreen,
        navigationOptions: {
            header: null
        }
    },
    DetailDivision: {
        screen: DetailDivisionScreen,
        navigationOptions: {
            header: null
        }
    },
    DetailEmployee: {
        screen: DetailEmployeeScreen,
        navigationOptions: {
            header: null
        }
    },
});

export default UsersStack;