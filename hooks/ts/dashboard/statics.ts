import axios from "axios";
import Constants from "expo-constants";
import { getTokens } from "../getTokens";
import { showMessage } from "react-native-flash-message";
import { useState, useEffect } from "react";

interface StaticsResponse {
    [key: string]: any;
}

interface StaticsError {
    message: string;
}


export async function getStatics() {
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
            `${Constants.manifest.extra.API_URL}/budgets/all/statistics`,
            { 
                headers, 
            }
        );

        if (response.status === 200) {
            return response.data as StaticsResponse[];
        }

        throw new Error('Failed to fetch statics');
    } catch (error) {
        console.error(error);
        return [] as StaticsError[];
    }
}


export async function getLinesData() {
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
            `${Constants.manifest.extra.API_URL}/budgets/all/info-cards`,
            { headers }
        );

        if (response.status === 200) {
            return response.data as StaticsResponse[];
        }

        throw new Error('Failed to fetch budget requests');
    } catch (error) {
        console.error(error);
        return [] as StaticsError[];
    }
}


export async function getTransactinsPerMonth() {
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
            `${Constants.manifest.extra.API_URL}/transactions/all/statics`,
            { headers }
        );

        if (response.status === 200) {
            // Retornar los datos procesados
            return response.data.data as StaticsResponse[];
        }

        throw new Error('Failed to fetch budget requests');
    } catch (error) {
        console.error(error);
        return [] as StaticsError[];
    }
}


export async function getTransactionList(){
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
            `${Constants.manifest.extra.API_URL}/transactions/last/department`,
            { headers }
        );

        if (response.status === 200) {
            // Retornar los datos procesados
            return response.data.data;
        }

        throw new Error('Failed to fetch budget requests');
    } catch (error) {
        console.error(error);
        return [] as StaticsError[];
    }
}