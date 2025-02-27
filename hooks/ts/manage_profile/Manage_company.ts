import axios from 'axios'
import { getTokens } from '../getTokens'
import Constants from 'expo-constants'
import { showMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

/*{  USER FUNCTINOS FETCH, DELETE, UPDATE }*/

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


// Create a new user
export async function addUser(newUser: { first_name: string, last_name:string, email: string, password: string,department_id:string, role: string }) {
    try {
        const user = await AsyncStorage.getItem('userInfo')

        if (!user) {
            throw new Error('User information not found')
        }

        const Newdata = {
            ...newUser,
        }

        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/users/create`

        const response = await axios.post(url, Newdata, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })

        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error adding user",
            type: 'danger',
        })
        console.error(error)
    }
}


/*{  COMPANY FUNCTINOS FETCH, DELETE, UPDATE }*/

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

/*{  DEPARTMENT FUNCTINS FETCH, DELETE, UPDATE }*/

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


export async function addDepartment(newDepartment: { department_name: string, department_description: string }) {

    try {
        const user = await AsyncStorage.getItem('userInfo')

        if (!user) {
            throw new Error('User information not found')
        }

        const ID = JSON.parse(user).company_id
        
        
        const Newdata = {
            ...newDepartment,
            company_id: ID
        }

        console.log(Newdata)
        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }


        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/departments/create`

        const response = await axios.post(url, Newdata, {
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

// Update a department
export async function updateDepartment(department: { id: any, name: string, description: string }) {
    try {
        if (!department.id || !department.name || !department.description) {
            throw new Error('Invalid department data')
        }

        const data = {
            id: department.id,
            department_name: department.name,
            department_description: department.description,
        }

        const access_token = await getTokens()

        if (!access_token) {
            throw new Error('Access token not found')
        }

        const apiurl = Constants.expoConfig?.extra?.API_URL

        if (!apiurl) {
            throw new Error('API_URL not found')
        }

        const url = `${apiurl}/departments/update/${department.id}`
        console.log(data)
        const response = await axios.put(url, data, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })

        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error updating department",
            type: 'danger',
        })
        console.error(error)
    }
}

// Delete a department
export async function deleteDepartment(id: any) {
    try{
        if (!id) {
            throw new Error('Invalid department id')
        }
        const access_token = await getTokens()
        if (!access_token) {
            throw new Error('Access token not found')
        }
        const apiurl = Constants.expoConfig?.extra?.API_URL
        if (!apiurl) {
            throw new Error('API_URL not found')
        }
        const url = `${apiurl}/departments/delete/${id}`
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        })
        return response.data
    } catch (error) {
        showMessage({
            message: 'Error',
            description: "Error deleting department",
            type: 'danger',
        })
        console.error(error)
    }
}