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
    company_name: string;
    company_email: string;
    company_size: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_state: string;
    company_zip: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export async function onRegister(email: string, password: string, first_name: string, last_name: string, navigation: any, company_name: string, company_email: string, company_size: string , company_phone: string, company_address: string, company_city: string, company_state: string, company_zip: string, login: (token: string) => void) {
    console.log('try to register');

    const data: RegisterRequest = {
        company_name,
        company_email,
        company_size,
        company_phone,
        company_address,
        company_city,
        company_state,
        company_zip,
        first_name,
        last_name,
        email,
        password,
    };
    console.log(data);

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
        
        const token = response.data.token.original;
        
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
        
            await AsyncStorage.setItem("access_token", token.access_token);
            const expirationTime = Date.now() + token.expires_in * 1000;
            await AsyncStorage.setItem("expires_in", expirationTime.toString());
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
