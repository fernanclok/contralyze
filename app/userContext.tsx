import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser({ firstName: parsedUserInfo.first_name, lastName: parsedUserInfo.last_name });
      }
    };
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);