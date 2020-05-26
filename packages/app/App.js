import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Button } from 'react-native';
import Constants from 'expo-constants';
import { AsyncStorage } from 'react-native';

import SignInScreen from './screens/SignInScreen'
import SignUpScreen from './screens/SignUpScreen'

import { getUserFromStorage, setUserInStorage } from '@healthapp/common/services/storage'
import { getTimeNow } from '@healthapp/common/date'
import { useJsonPlaceholder } from '@healthapp/common/services/api'
import { me } from '@healthapp/common/services/auth'
import useAuthReducer from '@healthapp/common/hooks/useAuthReducer'

const Stack = createStackNavigator();


export const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}


const SignoutButton = () => {
  const { signOut } = React.useContext(AuthContext);

  return <Button title="Sign out" onPress={() => {
    setUserInStorage(null, AsyncStorage)
    signOut()
  }} />
}

const Todo = todo => {
  return <Text style={styles.item} onPress={todo.onPress}>{todo.title}</Text>
}

function DetailsScreen ({ route, navigation }) {
  const { itemId } = route.params;
  const { title } = route.params;
  return (
    <View>
      <SignoutButton />

      <Text>This is details view for todo with id: {itemId}</Text>
      <Text>Todo title: {title}</Text>
    </View>
  )
}

function HomeScreen({ navigation }) {
  const [isLoading, data] = useJsonPlaceholder()
  const state = React.useContext(AuthContext)
  return (
    <SafeAreaView style={styles.container}>
      <Text>Time from @ivan/common: {getTimeNow()}</Text>
      <Text>Loggedin user is: {state?.user?.username}</Text>
      <SignoutButton />

      {isLoading
        ? <Text>Loading data...</Text>
        : <FlatList
          data={data}
          renderItem={({ item }) => (
            <Todo
              key={item.id}
              id={item.id}
              title={item.title}
              onPress={_ => navigation.navigate("Details", {
                itemId: item.id,
                title: item.title,
              })}
            />
          )}
          keyExtractor={item => `${item.id}`}
      />
      }
    </SafeAreaView>
  );
}


export default function App() {
  const [authState, authDispatch] = useAuthReducer()

  React.useEffect(() => {
    authDispatch({type: 'GET_USER_REQUEST'})
    getUserFromStorage(AsyncStorage)
    .then(user => {
      if (user) {
        authDispatch({type: 'GET_USER_SUCCESS', payload: user})
      } else {
        authDispatch({type: 'GET_USER_SUCCESS', payload: null})
      }
    })
  }, [])

  const authContext = {
    ...authState,
    signIn: async data => {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `AsyncStorage`
      // In the example, we'll use a dummy token

      authDispatch({type: 'GET_USER_REQUEST'})
      const userRes = await me({...data}, AsyncStorage)
      authDispatch({type: "GET_USER_SUCCESS", payload: userRes.data})
    },
    signOut: () => authDispatch({ type: 'REMOVE_USER' }),
    // signUp: async data => {
    //   // In a production app, we need to send user data to server and get a token
    //   // We will also need to handle errors if sign up failed
    //   // After getting token, we need to persist the token using `AsyncStorage`
    //   // In the example, we'll use a dummy token

    //   dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    // },
  }



  console.log('authState from App', authState)
  return <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {authState?.isAuthenticated
            ? <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
            : <Stack.Navigator>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Navigator>
          }
      </NavigationContainer>
    </AuthContext.Provider>
}
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
