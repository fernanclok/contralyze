import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';

interface TokenResponse {
    access_token: string;
    expires_in: string;
}

export async function getTokens(): Promise<string | null> {
    try {
        const access_token = await AsyncStorage.getItem("access_token");
        const expires_in = await AsyncStorage.getItem("expires_in");

        if (!access_token || !expires_in) {
            console.warn("No token found in storage");
            return null; // Retorna null si no hay token almacenado
        }

        const expiresInNumber = parseInt(expires_in, 10);

        // Si el token sigue válido, lo devolvemos
        if (Date.now() < expiresInNumber) {
            console.log("Token is still valid");
            return access_token;
        }

        console.log("Token expired, attempting refresh...");

        const apiurl = Constants.expoConfig?.extra?.API_URL;
        if (!apiurl) {
            console.error("API_URL not found");
            return null;
        }

        const url = `${apiurl}/auth/refresh`;

        try {
            // Solicitud para refrescar el token
            const response = await axios.post<TokenResponse>(url, {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/json",
                },
            });

            const newToken = response.data.access_token;
            const newExpiresIn = response.data.expires_in;

            // Guardamos el nuevo token en AsyncStorage
            await AsyncStorage.setItem("access_token", newToken);
            const expirationTime = Date.now() + newExpiresIn * 1000;
            await AsyncStorage.setItem("expires_in", expirationTime.toString());

            console.log("Token refreshed and stored successfully");
            return newToken;
        } catch (refreshError: any) {
            if (refreshError.response?.status === 401) {
                console.error("Token blacklisted or invalid, clearing storage...");
                await AsyncStorage.removeItem("access_token");
                await AsyncStorage.removeItem("expires_in");
                return null; // Se requiere nuevo login
            }
            console.error("Error refreshing token:", refreshError);
            return null;
        }
    } catch (error) {
        console.error("Error in getTokens:", error);
        return null;
    }
}
