import Constants from 'expo-constants';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

interface BudgetRequest {
  id?: number;
  category_id: number;
  category_name?: string;
  requested_amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  request_date?: string;
}

export async function getBudgetRequests() {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.get(`${apiurl}/budget-requests`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    showMessage({
      message: 'Error loading budget requests',
      description: error.message,
      type: 'danger'
    });
    console.error('Error fetching budget requests:', error);
    return [];
  }
}

export async function createBudgetRequest(requestData: Omit<BudgetRequest, 'id' | 'status' | 'request_date' | 'category_name'>) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.post(`${apiurl}/budget-requests`, {
      ...requestData,
      status: 'pending'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.success) {
      showMessage({
        message: 'Budget request created successfully',
        type: 'success'
      });
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    showMessage({
      message: 'Error creating budget request',
      description: error.message,
      type: 'danger'
    });
    throw error;
  }
}

export async function updateBudgetRequest(id: number, requestData: Partial<BudgetRequest>) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.put(`${apiurl}/budget-requests/${id}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.success) {
      showMessage({
        message: 'Budget request updated successfully',
        type: 'success'
      });
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    showMessage({
      message: 'Error updating budget request',
      description: error.message,
      type: 'danger'
    });
    throw error;
  }
}

export async function deleteBudgetRequest(id: number) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.delete(`${apiurl}/budget-requests/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.success) {
      showMessage({
        message: 'Budget request deleted successfully',
        type: 'success'
      });
      return true;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    showMessage({
      message: 'Error deleting budget request',
      description: error.message,
      type: 'danger'
    });
    throw error;
  }
}

const budgetRequestService = {
  getBudgetRequests,
  createBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest
};

export default budgetRequestService; 