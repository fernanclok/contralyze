import axios from 'axios';
import Constants from 'expo-constants';
import { showMessage } from 'react-native-flash-message';

interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category_id: number;
  user_id: number;
  budget_id: number;
  transaction_date: string;
}

export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'user_id'>, navigation: any) {
  try {
    const user_id = 1; // Temporal para pruebas
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    const response = await axios.post(
      `${apiurl}/transactions/create`,
      { ...transactionData, user_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    showMessage({
      message: 'Transaction created successfully',
      type: 'success'
    });

    return response.data;
  } catch (error) {
    showMessage({
      message: 'Error creating transaction',
      type: 'danger'
    });
    throw error;
  }
}

export async function getTransactions(budgetId?: number) {
  try {
    const user_id = 1; // Temporal para pruebas
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    const url = budgetId 
      ? `${apiurl}/transactions/budget/${budgetId}`
      : `${apiurl}/transactions/user/${user_id}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    showMessage({
      message: 'Error fetching transactions',
      type: 'danger'
    });
    throw error;
  }
}

export async function updateTransaction(id: number, transactionData: Partial<Transaction>) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    const response = await axios.put(
      `${apiurl}/transactions/${id}`,
      transactionData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    showMessage({
      message: 'Transaction updated successfully',
      type: 'success'
    });

    return response.data;
  } catch (error) {
    showMessage({
      message: 'Error updating transaction',
      type: 'danger'
    });
    throw error;
  }
}

export async function deleteTransaction(id: number) {
  try {
    const apiurl = Constants.expoConfig?.extra?.API_URL;
    
    await axios.delete(`${apiurl}/transactions/${id}`);

    showMessage({
      message: 'Transaction deleted successfully',
      type: 'success'
    });
  } catch (error) {
    showMessage({
      message: 'Error deleting transaction',
      type: 'danger'
    });
    throw error;
  }
} 