import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Constants  from 'expo-constants';
import {getTokens} from '../getTokens';
import axios from 'axios';

interface BudgetRequestResponse{
    [key: string]: any;
}

interface BudgetRequestError{
    message: string;
}

export async function getBudgetsRequests(){
    try {
    
        const access_token = await getTokens();
    
        if (!access_token) {
    
            throw new Error('Access token not found');
    
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/budget-requests/all`,
             { headers }
            );
        
        if (response.status === 200){
            showMessage({
                message: 'Success',
                description: 'Budget Requests fetched successfully',
                type: 'success',
            });
            // Extraer solo la lista de "requests" del objeto de respuesta
            const { requests } = response.data;
    
            // Retornar los datos procesados
            return requests as BudgetRequestResponse[];
        }
        
        throw new Error('Failed to fetch budget requests');
    
    } catch (error) {
        showMessage({
            message: 'Error',
            description: error.message || 'An error occurred',
            type: 'danger',
        });
        console.error(error);
        return [] as BudgetRequestError[];
    }

}

export async function approveBudgetRequest(id: number) {
    try {
        const access_token = await getTokens();

        if (!access_token) {
            throw new Error('Access token not found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        const response = await axios.put(
            `${Constants.expoConfig?.extra?.API_URL}/budget-requests/${id}/approve`,
            {},
            { headers }
        );

        if (response.status === 200) {
            showMessage({
                message: 'Success',
                description: 'Budget Request approved successfully',
                type: 'success',
            });
            return true;
        }

        throw new Error('Failed to approve budget request');
    } catch (error: any) {
        // Verificar si el error tiene una respuesta de Axios
        if (error.response && error.response.data && error.response.data.error) {
            const apiErrorMessage = error.response.data.error; // Extraer el mensaje de error de la API
            console.log(apiErrorMessage);
            showMessage({
                message: 'Error',
                description: apiErrorMessage, // Mostrar el mensaje específico de la API
                type: 'danger',
            });
        } else {
            // Manejar otros errores genéricos
            showMessage({
                message: 'Error',
                description: error.message || 'An error occurred',
                type: 'danger',
            });
        }

        console.error(error);
        return false;
    }
}

export async function rejectBudgetRequest(id: number) 
{
    try {
        const access_token = await getTokens();

        if (!access_token) {
            throw new Error('Access token not found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        const response = await axios.put(
            `${Constants.expoConfig?.extra?.API_URL}/budget-requests/${id}/reject`,
            {},
            { headers }
        );

        if (response.status === 200) {
            showMessage({
                message: 'Success',
                description: 'Budget Request rejected successfully',
                type: 'success',
            });
            return true;
        }

        throw new Error('Failed to reject budget request');
    } catch (error: any) {
        // Verificar si el error tiene una respuesta de Axios
        if (error.response && error.response.data && error.response.data.error) {
            const apiErrorMessage = error.response.data.error; // Extraer el mensaje de error de la API
            console.log(apiErrorMessage);
            showMessage({
                message: 'Error',
                description: apiErrorMessage, // Mostrar el mensaje específico de la API
                type: 'danger',
            });
        } else {
            // Manejar otros errores genéricos
            showMessage({
                message: 'Error',
                description: error.message || 'An error occurred',
                type: 'danger',
            });
        }

        console.error(error);
        return false;
    }
}

export async function getAllBudgetsByUser(id:number)
{
    try {
        const access_token = await getTokens();

        if (!access_token) {
            throw new Error('Access token not found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        const response = await axios.get(
            `${Constants.expoConfig?.extra?.API_URL}/budget-requests/all`,
            { 
                headers, 
                params: { userId: id } 
            }
        );

        if (response.status === 200) {
            showMessage({
                message: 'Success',
                description: 'Budget Requests fetched successfully',
                type: 'success',
            });
            // Extraer solo la lista de "requests" del objeto de respuesta
            const { requests } = response.data;

            // Retornar los datos procesados
            return requests as BudgetRequestResponse[];
        }

        throw new Error('Failed to fetch budget requests');
    } catch (error) {
        showMessage({
            message: 'Error',
            description: error.message || 'An error occurred',
            type: 'danger',
        });
        console.error(error);
        return [] as BudgetRequestError[];
    }
}