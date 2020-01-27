import { createStackNavigator } from 'react-navigation-stack';
import ClientScreen from './ClientScreen';
import AddClientScreen from './AddClientScreen'
import DetailClientScreen from './DetailClientScreen'
import EditClientScreen from './EditClientScreen'
const ClientStack = createStackNavigator({
    Client: {
        screen: ClientScreen,
        navigationOptions: {
            header: null
        }
    },
    AddClient: {
        screen: AddClientScreen,
        navigationOptions: {
            header: null
        }
    },
    DetailClient: {
        screen: DetailClientScreen,
        navigationOptions: {
            header: null
        }
    },
    EditClient: {
        screen: EditClientScreen,
        navigationOptions: {
            header: null
        }
    }
});

export default ClientStack;