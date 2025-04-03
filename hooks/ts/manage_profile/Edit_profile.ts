import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import Constants from 'expo-constants';
import { getTokens } from '../getTokens';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function updateUserProfile(user) {
    try {
        if (!user.id || !user.first_name || !user.last_name || !user.email || !user.role || !user.department_id) {
            throw new Error('Invalid user data');
        }
        console.log('Updating user:', user);

        const data = new FormData();
        data.append('first_name', user.first_name);
        data.append('last_name', user.last_name);
        data.append('email', user.email);
        data.append('role', user.role);
        data.append('status', 'active');
        data.append('department_id', user.department_id);

       
    if (user.profilePicture) {
        console.log('Processing profile picture...');
  
        // Verifica si el formato es base64
        if (user.profilePicture.startsWith('data:image')) {
          // Extraer la extensión y los datos de la imagen
          let matches = user.profilePicture.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) throw new Error('Invalid image format');
  
          let ext = matches[1]; // Obtiene la extensión (jpeg, png, etc.)
          let base64Data = matches[2]; // Obtiene solo los datos en base64
  
          // Convertir base64 a Blob
          let byteCharacters = atob(base64Data);
          let byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          let blob = new Blob([byteArray], { type: `image/${ext}` });
  
          // Crear un archivo válido para FormData
          let filename = `profile.${ext}`;
          data.append('photo_profile', new File([blob], filename, { type: `image/${ext}` }));
        } else {
          // Si no es base64, asumir que es una URI de archivo normal
          let filename = user.profilePicture.split('/').pop();
          let match = /\.(\w+)$/.exec(filename);
          let filetype = match ? `image/${match[1]}` : 'image/jpeg';
  
          data.append('photo_profile', {
            uri: user.profilePicture,
            type: filetype,
            name: filename,
          });
        }
      } else {
        console.log('No profile picture');
      }

        // Obtener el token de acceso
        const access_token = await getTokens();
        if (!access_token) {
            throw new Error('Access token not found');
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL;
        if (!apiurl) {
            throw new Error('API_URL not found');
        }

        const url = `${apiurl}/users/update/${user.id}`;

        data.append('_method', 'PUT'); // Para compatibilidad con Laravel
        
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            showMessage({
                message: 'Success',
                description: 'User updated successfully',
                type: 'success',
            });
            
            // save the user data in the local storage
            await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));

            return response.data;
        } else {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showMessage({
            message: 'Error',
            description: `Error updating user: ${error.message}`,
            type: 'danger',
        });
    }
}