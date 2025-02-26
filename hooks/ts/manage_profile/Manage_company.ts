import axios from 'axios'
import { getTokens } from '../getTokens'
import Constants from 'expo-constants'
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'


// get all users by user company
interface UserListResponse {
    [key: string]: any
}

export async function fetchUsers() {
    try {
        const user = await AsyncStorage.getItem('userInfo')

        if (!user) {
            throw new Error('User information not found')
        }

        const ID = JSON.parse(user).company_id

        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/companies/company/users/${ID}`

        const response = await axios.get<UserListResponse>(url, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })
        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error fetching users",
            type: 'danger',
        })
        console.error(error)
    }
}


// get company info by user

interface CompanyResponse {
    [key: string]: any
}

export async function fetchCompanyData() {
    try {
        const user = await AsyncStorage.getItem('userInfo')

        if (!user) {
            throw new Error('User information not found')
        }

        const ID = JSON.parse(user).company_id

        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/companies/company/${ID}`

        const response = await axios.get<CompanyResponse>(url, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })

        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error fetching company",
            type: 'danger',
        })
        console.error(error)
    }
}




// get all departaments by user company

interface DepartamentResponse {
    [key: string]: any
}

export async function fetchDepartaments() {
   try {
    const user = await AsyncStorage.getItem('userInfo')

    if (!user) {
        throw new Error('User information not found')
    }

    const ID = JSON.parse(user).company_id


    const access_token = await getTokens()

    if (!access_token) {
        throw new Error('Access token not found')
    }
    

    const apiurl = Constants.expoConfig?.extra?.API_URL

    if (!apiurl) {
        throw new Error('API_URL not found')
    }

    const url = `${apiurl}/departments/all/${ID}`

    const response = await axios.get<DepartamentResponse>(url, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
        },
    })

    return response.data
} catch (error) {
    showMessage({
        message: 'Error',
        description: "Error fetching users",
        type: 'danger',
    })
    console.error(error)
}
}

// Create a new department


export async function addDepartment(name: string, description: string,) {
    try {
        const user = await AsyncStorage.getItem('userInfo')

        if (!user) {
            throw new Error('User information not found')
        }

        const ID = JSON.parse(user).company_id
        
        if(!name || !description){
            throw new Error('Name or description not found')
        }

        const newDepartment = {
            name: name,
            description: description,
            company_id: ID
        }

        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }


        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/departments/create/${ID}`

        const response = await axios.post(url, newDepartment, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })

        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error adding department",
            type: 'danger',
        })
        console.error(error)
    }
}