import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants  from 'expo-constants';
import { showMessage } from 'react-native-flash-message';

interface LoginResponse {
    user: {
        [key: string]: any;
      };
  }

interface LoginError {
    message: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export async function onLogin(email: string, password: string, navigation: any, login: (user: any) => void) {
    console.log('try to login');

    const data: LoginRequest = {
        email,
        password,
    };

    try {
        const apiurl = Constants.expoConfig?.extra?.API_URL;
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        const url = `${apiurl}/login`;
        const response = await axios.post<LoginResponse>(
            url,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data);
        const U_information = response.data.user;
        if (U_information) {
            await AsyncStorage.setItem('userInfo', JSON.stringify(U_information));
            console.log('User information saved');
            login(U_information);
            showMessage({
                message: 'You have successfully logged in',
                type: 'success'
            });
            navigation.navigate('profile/dashboard');
        }
    } catch (error) {
        console.error(error);
        const err = error as LoginError;
        showMessage({
            message: err.message + ' Please check your credentials and try again.',
            type: 'danger'
        });

    }
}


export async function onLogout(navigation: any, logout: () => void) {
    console.log('try to logout');
    try {
        await AsyncStorage.removeItem('userInfo');
        logout();
        showMessage({
            message: 'You have successfully logged out',
            type: 'success'
        })
        navigation.navigate('/index');
    } catch (error) {
        console.error(error);
        showMessage({
            message: 'Logout failed. Please try again.',
            type: 'danger'
        });
    }
}