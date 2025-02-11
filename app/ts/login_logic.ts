import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { useUser } from '../userContext';
import Constants  from 'expo-constants';
import axios from 'axios';

interface LoginResponse {
    user: {
        [key: string]: any;
      };
    access_token: string;
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
        const url = `${apiurl}/user/login`;
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
        const U_information = response.data.user;
        const token = response.data.access_token;
        if (U_information) {
            await AsyncStorage.setItem('userInfo', JSON.stringify(U_information));
            console.log('User information saved');
            login(U_information);
            showMessage({
                message: 'You have successfully logged in',
                type: 'success'
            });
            navigation.navigate('profile/dashboard');
            // Actualizar el contexto del usuario
        }
        if (token) {
            await AsyncStorage.setItem("access_token", token);
            console.log("Token stored successfully");
        }
    } catch (error) {
        console.error(error);
        const err = error as LoginError;
        if (err.message === 'Request failed with status code 401') {
            showMessage({
                message: 'Invalid email or password',
                type: 'danger'
            });
        } else {
            showMessage({
                message: 'Login failed. Please try again.',
                type: 'danger'
            });
        }
    }
}


export async function onLogout(navigation: any, logout: () => void) {
    console.log('try to logout');
    try {
        await AsyncStorage.clear();
        logout();
        showMessage({
            message: 'You have successfully logged out',
            type: 'success'
        })
        navigation.navigate('index');
    } catch (error) {
        console.error(error);
        showMessage({
            message: 'Logout failed. Please try again.',
            type: 'danger'
        });
    }
}