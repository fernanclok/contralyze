import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import Constants  from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegisterResponse {
    [key: string]: any;
}

interface RegisterError {
    message: string;
}

interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export async function onRegister(email: string, password: string, first_name: string, last_name: string, navigation: any, login: (token: string) => void) {
    console.log('try to register');

    const data: RegisterRequest = {
        first_name,
        last_name,
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
        
        const url = `${apiurl}/auth/register`;
        
        const response = await axios.post<RegisterResponse>(url, data);
        
        console.log(response.data);
        
        const U_information = response.data.user;
        
        const token = response.data.access_token;
        
        if (U_information) {
        
            await AsyncStorage.setItem('userInfo', JSON.stringify(U_information));
        
            console.log('User information saved');
        
            login(U_information);
        
            showMessage({
        
                message: 'You have successfully registered',
                type: 'success'
        
            });
        
            navigation.navigate('profile/dashboard');
        
        }
        
        if (token) {
        
            await AsyncStorage.setItem("access_token", token);
        
            console.log("Token stored successfully");
        
        }
    
    } catch (error) {
    
        console.error(error);
    
        const err = error as RegisterError;
    
        showMessage({
    
            message: err.message,
            type: 'danger'
    
        });
    }
}
