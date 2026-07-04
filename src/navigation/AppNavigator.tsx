import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import colors from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import LoanDetailsScreen from '../screens/LoanDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600', fontSize: 16, color: colors.textPrimary },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} options={{ title: 'Loan Details' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Make Payment' }} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ title: 'Confirmation', headerBackVisible: false }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
