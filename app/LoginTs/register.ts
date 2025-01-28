import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import Constants  from 'expo-constants';

interface RegisterResponse {
    token: string;
    user: {
        id: number;
        email: string;
        last_name: string;
        first_name: string;
        role: string;
    };
}

interface RegisterError {
    message: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
}

export async function onRegister(email: string, password: string, first_name: string, last_name: string, navigation: any, login: (token: string) => void) {
    console.log('try to register');
    const role = 'user';
    const data: RegisterRequest = {
        email,
        password,
        first_name,
        last_name,
        role,
    };
    try {
        const apiurl = Constants.expoConfig?.extra?.API_URL;
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        const url = `${apiurl}/register`;
        const response = await axios.post<RegisterResponse>(url, data);
        console.log(response.data);
        showMessage({
            message: 'You have successfully registered',
            type: 'success'
        });
        login(response.data.token);
        navigation.navigate('profile/dashboard');
    } catch (error) {
        console.error(error);
        const err = error as RegisterError;
        showMessage({
            message: err.message,
            type: 'danger'
        });
    }
}