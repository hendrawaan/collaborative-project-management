import React, { Component } from 'react';
import MainApp from './src/navigation/MainApp';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { Provider as PaperProvider } from 'react-native-paper';
import { ApplicationProvider } from 'react-native-ui-kitten';
import AsyncStorage from '@react-native-community/async-storage';
import { Root } from 'native-base'
export default class App extends React.Component {

    render() {
        const uri = 'https://cpmserver.herokuapp.com/graphql'
        return (
            <PaperProvider>
                <Root>
                    <MainApp screenProps={{ token: uri}}/>
                </Root>
            </PaperProvider>
            );
    }
}