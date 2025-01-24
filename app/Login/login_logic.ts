import axios from 'axios';
import { Alert } from 'react-native';

import Constants  from 'expo-constants';

interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        last_name: string;
        first_name: string;
    };
}

interface LoginError {
    message: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export async function onLogin(email: string, password: string, navigation: any) {
    console.log('try to login');


    const data: LoginRequest = {
        email,
        password,
    };

    try {
        const apiurl = Constants.expoConfig?.extra?.API_URL;
        console.log(apiurl);
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        console.log(apiurl);
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        const url = `${apiurl}/login`;
        const response = await axios.post<LoginResponse>(url, data);
        console.log(response.data);
        navigation.navigate('profile/dashboard');
    } catch (error) {
        console.error(error);
        const err = error as LoginError;
        Alert.alert('Error', err.message);
    }
}