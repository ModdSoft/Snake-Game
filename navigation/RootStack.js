import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Game from '../src/components/Game';
import Home from '../src/components/Home';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Game" component={Game} />
    </Stack.Navigator>
  );
};

export default RootStack;
