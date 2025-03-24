// BudgetAdminScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc'; // Tailwind React Native Classnames
import { Ionicons } from '@expo/vector-icons';
import { getBudgetsRequests,approveBudgetRequest, rejectBudgetRequest } from '@/hooks/ts/budgets/B_actions'; // Importa la función de solicitud de presupuestos
import { showMessage } from 'react-native-flash-message';

// Obtener las dimensiones de la pantalla
const { height } = Dimensions.get('window');

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function BudgetAdminScreen() {
  const [budgets, setBudgets] = useState<{ id: number; status: string; requested_amount: string; category?: { name: string }; user?: { first_name: string; last_name: string }; request_date: string }[]>([]); // Inicialmente vacío
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga

  // Función para cargar los presupuestos desde la API
  const fetchBudgets = async () => {
    try {
      setLoading(true); // Mostrar indicador de carga
      const fetchedBudgets = await getBudgetsRequests(); // Llamar a la API
      setBudgets(fetchedBudgets); // Actualizar el estado con los datos obtenidos
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  // Llamar a fetchBudgets al montar el componente
  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleApprove = async (id:number) => {
    try{
        const response = await approveBudgetRequest(id);
        if (!response) {
            return null;
        }
        setBudgets(budgets.map(budget => 
            budget.id === id ? { ...budget, status: 'approved' } : budget
        ));
        showMessage({
            message: 'Success',
            description: 'Budget has been approved',
            type: 'success',
        });
    }catch(error){
        console.error('Error approving budget:', error);
        showMessage({
            message: 'Error',
            description: error.message || 'An error occurred',
            type: 'danger',
        });
    }
   
  };

  const handleReject = async (id:number) => {
    try{
        const response = await rejectBudgetRequest(id);
        if (!response) {
            return null;
        }
        setBudgets(budgets.map(budget => 
            budget.id === id ? { ...budget, status: 'rejected' } : budget
        ));
    }catch(error){
        console.error('Error rejecting budget:', error);
        showMessage({
            message: 'Error',
            description: error.message || 'An error occurred',
            type: 'danger',
        });
    }
    
  };

  const filteredBudgets = filter === 'all' 
    ? budgets 
    : budgets.filter(budget => budget.status === filter);

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  // Render each budget item
  const renderBudgetItem = ({ item: budget }) => (
    <View 
      style={tw`bg-white mx-4 my-2 rounded-lg shadow-sm overflow-hidden border border-gray-200`}
    >
      <View style={tw`p-4`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`font-bold text-lg text-gray-800`}>{budget.category?.name || 'N/A'}</Text>
          <View style={tw`
            px-2 py-1 rounded-full
            ${budget.status === 'approved' ? 'bg-green-100' : 
              budget.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'}
          `}>
            <Text style={tw`
              text-xs font-medium
              ${budget.status === 'approved' ? 'text-green-800' : 
                budget.status === 'rejected' ? 'text-red-800' : 'text-yellow-800'}
            `}>
              {budget.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={tw`text-2xl font-bold text-gray-900 mt-1`}>
          {formatCurrency(budget.requested_amount)}
        </Text>
        
        <View style={tw`mt-3`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-gray-500`}>Requested by:</Text>
            <Text style={tw`text-gray-700 ml-1`}>{budget.user?.first_name} {budget.user?.last_name}</Text>
          </View>
          <View style={tw`flex-row items-center mt-1`}>
            <Text style={tw`text-gray-500`}>Date:</Text>
            <Text style={tw`text-gray-700 ml-1`}>{formatDate(budget.request_date)}</Text>
          </View>
        </View>
        
        {budget.status === 'pending' && (
          <View style={tw`flex-row mt-4`}>
            <TouchableOpacity
              style={tw`flex-1 bg-green-500 py-2 rounded-md mr-2 flex-row justify-center items-center`}
              onPress={() => handleApprove(budget.id)}
            >
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={tw`text-white font-medium ml-1`}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-2 rounded-md flex-row justify-center items-center`}
              onPress={() => handleReject(budget.id)}
            >
              <Ionicons name="close-circle" size={16} color="white" />
              <Text style={tw`text-white font-medium ml-1`}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyList = () => (
    <View style={tw`p-4 items-center justify-center`}>
      <Text style={tw`text-gray-500`}>No budgets found</Text>
    </View>
  );

  // Render footer with summary
  const renderFooter = () => (
    <View style={tw`bg-white p-4 border-t border-gray-200`}>
      <Text style={tw`text-gray-600`}>
        Total Pending: {budgets.filter(b => b.status === 'pending').length}
      </Text>
      <Text style={tw`text-gray-600`}>
        Total Amount: {formatCurrency(budgets.reduce((sum, budget) => sum + parseFloat(budget.requested_amount), 0))}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={tw`bg-white p-4 border-b border-gray-200`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Budget Management</Text>
        <Text style={tw`text-gray-500 mt-1`}>Review and manage department budgets</Text>
      </View>
      
      {/* Filter Tabs */}
      <View style={tw`flex-row bg-white px-2 border-b border-gray-200`}>
        {['all', 'pending', 'approved', 'rejected'].map((filterType) => (
          <TouchableOpacity 
            key={filterType}
            style={tw`py-3 px-4 ${filter === filterType ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setFilter(filterType)}
          >
            <Text 
              style={tw`${filter === filterType ? 'text-blue-500 font-semibold' : 'text-gray-600'} capitalize`}
            >
              {filterType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Budget List */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={filteredBudgets}
          renderItem={renderBudgetItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderFooter}
          style={{ height: height * 0.7 }} // Ajusta la altura al 70% de la pantalla
        />
      )}
    </SafeAreaView>
  );
}