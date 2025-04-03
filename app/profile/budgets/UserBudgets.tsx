// BudgetViewScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getBudgetsRequests } from '@/hooks/ts/budgets/B_actions';
import tw from 'twrnc'; // Tailwind React Native Classnames

// Obtener las dimensiones de la pantalla
const { height } = Dimensions.get('window');

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function BudgetViewScreen() {
    const [budgets, setBudgets] = useState<{ id: number; status: string; requested_amount: string; category?: { name: string }; user?: { first_name: string; last_name: string }; request_date: string }[]>([]); // Inicialmente vacío;
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
  

    const fetchBudgets = async () => {
        try {
            setLoading(true); // Mostrar indicador de carga
            const fetchedBudgets = await getBudgetsRequests(); // Llamar a la API
            setBudgets(fetchedBudgets); // Actualizar el estado con los datos obtenidos
            } catch (error) {
            console.error('Error fetching budgets:', error);
        }
        finally {   
            setLoading(false); // Ocultar indicador de carga
        }
    }

    useEffect(() => {
        fetchBudgets();
    }, []);


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
    <View style={tw`bg-white p-4 border-t border-gray-200 `}>
      <Text style={tw`text-gray-600`}>
        Total Pending: {budgets.filter(b => b.status === 'pending').length}
      </Text>
      <Text style={tw`text-gray-600`}>
        Total Amount: {formatCurrency(budgets.reduce((sum, budget) => sum + budget.amount, 0))}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={tw`bg-white p-4 border-b border-gray-200`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Budget Management</Text>
        <Text style={tw`text-gray-500 mt-1`}>View department budgets</Text>
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