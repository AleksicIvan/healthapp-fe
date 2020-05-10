import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, TextInput, View } from 'react-native';
import { AsyncStorage } from 'react-native';

import { AuthContext } from '../App'
import { me } from '@healthapp/common/services/auth'
import { setUserInStorage } from '@healthapp/common/services/storage'
import useAuthReducer from '@healthapp/common/hooks/useAuthReducer'

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signIn } = React.useContext(AuthContext)

  // const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => {
        signIn({ username, password })
      }} />
    </View>
  );
}

export default SignInScreen