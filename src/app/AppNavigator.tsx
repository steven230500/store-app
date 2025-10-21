import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import {
  SplashScreen,
  HomeScreen,
  ProductDetailScreen,
  CheckoutScreen,
  PaymentScreen,
  StatusScreen,
  CategoryProductsScreen,
} from './index';
import { CartSummary } from '../modules/cart';
import { Product, Category } from '../core/types';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  ProductDetail: { product: Product };
  Checkout: undefined;
  Payment: undefined;
  Status: { transactionReference?: string };
  Cart: undefined;
  CategoryProducts: { category: Category };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
          >
            <Stack.Screen
              name="Splash"
              options={{ headerShown: false }}
            >
              {(props) => (
                <SplashScreen
                  {...props}
                  onReady={() => props.navigation.replace('Home')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => (
                <HomeScreen
                  {...props}
                  onProductPress={(product: Product) =>
                    props.navigation.navigate('ProductDetail', { product })
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Status"
              component={StatusScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cart"
              options={{ headerShown: false }}
            >
              {(props) => (
                <View style={{ flex: 1 }}>
                  <CartSummary
                    onCheckoutPress={() => props.navigation.navigate('Checkout')}
                  />
                </View>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="CategoryProducts"
              options={{ headerShown: false }}
            >
              {(props) => (
                <CategoryProductsScreen
                  {...props}
                  category={props.route.params.category}
                  onProductPress={(product: Product) =>
                    props.navigation.navigate('ProductDetail', { product })
                  }
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default AppNavigator;