import Constants from 'expo-constants';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

interface Budget {
  id?: number;
  category_id: number;
  category_name: string;
  max_amount: number;
  remaining_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  spent: number;
}

export async function getBudgets() {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.get(`${apiurl}/budgets/all`, {
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
      message: 'Error loading budgets',
      description: error.message,
      type: 'danger'
    });
    console.error('Error fetching budgets:', error);
    return [];
  }
}

export async function createBudget(budgetData: Omit<Budget, 'id' | 'remaining_amount' | 'spent' | 'category_name'>) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    if (!apiurl) {
      throw new Error('API_URL not configured');
    }

    const response = await axios.post(`${apiurl}/budgets/create`, budgetData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.success) {
      showMessage({
        message: 'Budget created successfully',
        type: 'success'
      });
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    showMessage({
      message: 'Error creating budget',
      description: error.message,
      type: 'danger'
    });
    throw error;
  }
}

const budgetService = {
  createBudget,
  getBudgets,
};

export default budgetService; 