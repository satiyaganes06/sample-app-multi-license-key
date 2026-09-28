import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ZDefendContainer from './ZDefendContainer';
import DeveloperContainer from './DeveloperContainer';
import URLClassificationContainer from './URLClassificationContainer';
import TroubleshootContainer from './TroubleshootContainer';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="ZDefend" component={ZDefendContainer} />
        <Tab.Screen name="Developer" component={DeveloperContainer} />
        <Tab.Screen name="URL Classification" component={URLClassificationContainer} />
        <Tab.Screen name="Troubleshoot" component={TroubleshootContainer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}