import axios from 'axios';
import Constants  from 'expo-constants';
import { useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClientResponse {
    [key: string]: any;
}   

interface ClientError {
    message: string;
}

interface ClientRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    user_id: number;
}

export async function onClient(name: string, email: string, phone: string, address: string, navigation: any) {
    console.log('try to register client');
    

    // obtener token de usuario
    const access_token = await AsyncStorage.getItem('access_token');
    if (!access_token) {
        throw new Error('Access token not found');
    }

    // obtener id del cliente que lo crea
    const user = await AsyncStorage.getItem('userInfo');
    if (!user) {
        throw new Error('User information not found');
    }
    const user_id = JSON.parse(user).id;
    const data: ClientRequest = {
        name,
        email,
        phone,
        address,
        user_id: user_id
        };
    try {
        const apiurl = Constants.expoConfig?.extra?.API_URL;
        if (!apiurl) {
            throw new Error('API_URL not found');
        }
        const url = `${apiurl}/client/create`;
        const response = await axios.post<ClientResponse>(
            url,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        );
        showMessage({
            message: 'Client registered successfully',
            type: 'success'
        });
        // Actualizar la lista de clientes en el almacenamiento
        await fetchAndUpdateClients(access_token, user_id);

        navigation.navigate('profile/clients/clientList', { refresh: true });
    } catch (error) {
        console.error(error);
        const err = error as ClientError;
        showMessage({
            message: err.message + 'Error registering client',
            type: 'danger'
        });
    }
}

interface ClientListResponse {
    [key: string]: any;
}


export async function getClients() {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        if (!access_token) {
            throw new Error('Access token not found');
        }
        const user = await AsyncStorage.getItem('userInfo');
        if (!user) {
            throw new Error('User information not found');
        }
        const user_id = JSON.parse(user).id;
        const cachedClients = await AsyncStorage.getItem('clients');
        if (cachedClients) {
            // Return cached clients immediately
            const clients = JSON.parse(cachedClients);
            // Fetch new clients in the background
            fetchAndUpdateClients(access_token, user_id);

            return clients;
        } else {
            // Fetch clients if no cached data is available
            return await fetchAndUpdateClients(access_token, user_id);
        }
    } catch (error) {
        console.error(error);
        const err = error as ClientError;
        showMessage({
            message: err.message + ' Error fetching clients',
            type: 'danger'
        });
        throw error;
    }
}

export async function fetchAndUpdateClients(access_token: string, user_id: number) {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    if (!apiurl) {
        throw new Error('API_URL not found');
    }
    const url = `${apiurl}/client/byUser/${user_id}`;
    const response = await axios.get<ClientListResponse>(url, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    });
    await AsyncStorage.setItem('clients', JSON.stringify(response.data));
    return response.data;
}