import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Constants  from 'expo-constants';
import axios from 'axios';
import {getTokens} from './getTokens';

interface LoginResponse {

    user: {
        [key: string]: any;
      };
    
      token: {
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
        const url = `${apiurl}/auth/login`;

        const response = await axios.post<LoginResponse>(url, data,
            
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            
            }

        );
        console.log(response.data);
        const U_information = response.data.user;

        const token = response.data.token.original;
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

            await AsyncStorage.setItem("access_token", token.access_token);
            const expirationTime = Date.now() + token.expires_in * 1000;
            await AsyncStorage.setItem("expires_in", expirationTime.toString());
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
        const apiurl = Constants.expoConfig?.extra?.API_URL;
        const access_token = await getTokens();
        if (!apiurl) {

            throw new Error('API_URL not found');

        }

        const url = `${apiurl}/auth/logout`;
        const response = await axios.post<LoginResponse>(url, {}, { 
            headers: { 
                Authorization: `Bearer ${access_token}`, 
                Accept: "application/json" 
            } 
        });

        const message = response.data;
        

        await AsyncStorage.clear();
    
        logout();
    
        showMessage({
            message: 'You have successfully logged out',
            type: 'success'
        })
    
        navigation.reset({
            index: 0,
            routes: [{ name: "index" }],
        });
    
    } catch (error) {
    
        console.error(error);
    
        showMessage({
            message: 'Logout failed. Please try again.',
            type: 'danger'
        });
    
    }
}