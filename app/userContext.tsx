import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser({ firstName: parsedUserInfo.first_name, lastName: parsedUserInfo.last_name });
      }
      setLoading(false);
    };
    getUserInfo();
  }, []);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);