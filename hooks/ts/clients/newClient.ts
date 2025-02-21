import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Constants  from 'expo-constants';
import {getTokens} from '../getTokens';
import axios from 'axios';


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

    const verify_token = await getTokens();

    if (!verify_token) {
    
        throw new Error('Tokens not found');
    
    }
    
    const access_token = verify_token;
    
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
   
        const url = `${apiurl}/clients/create`;
   
        const response = await axios.post<ClientResponse>(url,data,
            {
                headers: {
                
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                
                },
            }
        );

        console.log('Client registered successfully', response.data);

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
    
        const access_token = await getTokens();
    
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

    const url = `${apiurl}/clients/all/${user_id}`;

    

    const response = await axios.get<ClientListResponse>(url, {

        headers: {
            'Authorization': `Bearer ${access_token}`,
        },

    });

    await AsyncStorage.setItem('clients', JSON.stringify(response.data));

    return response.data;
}

export async function deleteClient(user_id: string) {
    
    try {
        const access_token = await getTokens();


        if (!access_token) {

            throw new Error('Access token not found');

        }

        if(!user_id) {
            
            throw new Error('Client ID not found');
        
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL;

        if (!apiurl) {

            throw new Error('API_URL not found');

        }

        const url = `${apiurl}/clients/client/delete/${user_id}`;

        const response = await axios.delete(url, {

            headers: {
                'Authorization': `Bearer ${access_token}`,
            },

        });

        console.log('Client deleted successfully', response.data);

        if (response.data) {

            // Actualizar la lista de clientes en el almacenamiento

            await fetchAndUpdateClients(access_token, user_id);

        }

        showMessage({
            message: 'Client deleted successfully',
            type: 'success'
        });

        // Actualizar la lista de clientes en el almacenamiento
        return response.data;

    } catch (error) {

        console.error(error);

        const err = error as ClientError;

        showMessage({
            message: err.message + ' Error deleting client',
            type: 'danger'

        });

        throw error;
    }
}

interface UpdateClientResponse {
    [key: string]: any;
}

export async function updateClient(id:number,name: string, email: string, phone: string, address: string, navigation: any){
    try{
        console.log('try to update client');
        if(!id || !name || !email || !phone || !address){
            throw new Error('Please fill in all fields')
        }
        const user = await AsyncStorage.getItem('userInfo');

        if (!user) {
       
            throw new Error('User information not found');
       
        }
       
        const user_id = JSON.parse(user).id;

        const data = {
            name,
            email,
            phone,
            address
        }

        const access_token = await getTokens()

        if(!access_token){
            throw new Error ('No token found')
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL;

        if (!apiurl) {

            throw new Error('API_URL not found');

        }

        const url = `${apiurl}/clients/client/update/${id}`;
        
        const response = await axios.put<UpdateClientResponse>(url, data,
            {
                headers: {
                
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                
                },
            }
        );

        console.log('Client updated successfully', response.data);

        showMessage({
            message: 'Client updated successfully',
            type: 'success'
        });

         // Actualizar la lista de clientes en el almacenamiento

         await fetchAndUpdateClients(access_token, user_id);

         navigation.navigate('profile/clients/clientList', { refresh: true });

    }catch(error){
        console.log(error)
    }
}