import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getBudgets } from '../../ts/budgets/budgetService';
import { ProtectedRoute } from '../../AuthProvider';
import MainLayout from '../../components/MainLayout';
import tw from 'twrnc';
import { usePusher } from '../../../hooks/usePusher';

const BudgetHomeScreen = () => {
  const navigation = useNavigation();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [activeBudgets, setActiveBudgets] = useState(0);

  useEffect(() => {
    fetchBudgets();

    // Configurar Pusher
    const { subscribeToChannel } = usePusher();

    const unsubscribe = subscribeToChannel('budget-requests', ['new-request', 'request-approved', 'request-rejected'], (data) => {
      console.log('Event received:', data);
      fetchBudgets(); // Update stats and recent budgets
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
      calculateStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (budgetData) => {
    const total = budgetData.reduce((sum, budget) => sum + budget.max_amount, 0);
    const active = budgetData.filter(budget => budget.status === 'active').length;
    setTotalBudget(total);
    setActiveBudgets(active);
  };

  const QuickActionButton = ({ icon, label, onPress, color = 'blue' }) => (
    <TouchableOpacity
      style={tw`flex-1 bg-${color}-50 rounded-2xl p-4 items-center justify-center`}
      onPress={onPress}
    >
      <View style={tw`bg-${color}-100 p-3 rounded-full mb-2`}>
        <Feather name={icon} size={24} color={`#${color === 'blue' ? '3B82F6' : '10B981'}`} />
      </View>
      <Text style={tw`text-gray-800 font-medium text-center`}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
          <ScrollView style={tw`flex-1`}>
            {/* Header */}
            <View style={tw`bg-blue-600 pt-8 pb-16 px-6 rounded-b-3xl`}>
              <Text style={tw`text-white text-3xl font-bold mb-2`}>
                Budget Management
              </Text>
              <Text style={tw`text-blue-100`}>
                Track and manage your budgets efficiently
              </Text>
            </View>

            {/* Stats Cards */}
            <View style={tw`px-6 -mt-8`}>
              <View style={tw`bg-white rounded-2xl shadow-lg p-6 mb-6`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <View>
                    <Text style={tw`text-gray-500 mb-1`}>Total Budget</Text>
                    <Text style={tw`text-2xl font-bold text-gray-800`}>
                      ${totalBudget.toFixed(2)}
                    </Text>
                  </View>
                  <View style={tw`bg-blue-100 p-3 rounded-full`}>
                    <Feather name="dollar-sign" size={24} color="#3B82F6" />
                  </View>
                </View>
                <View style={tw`flex-row`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-500 text-sm`}>Active Budgets</Text>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>
                      {activeBudgets}
                    </Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-500 text-sm`}>Total Budgets</Text>
                    <Text style={tw`text-lg font-semibold text-gray-800`}>
                      {budgets.length}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={tw`px-6 mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
                Quick Actions
              </Text>
              <View style={tw`flex-row gap-4 mb-4`}>
                <QuickActionButton
                  icon="plus-circle"
                  label="New Budget"
                  onPress={() => navigation.navigate('profile/budgets/create')}
                />
                <QuickActionButton
                  icon="file-plus"
                  label="New Request"
                  onPress={() => navigation.navigate('profile/budgets/create-request')}
                  color="green"
                />
              </View>
            </View>

            {/* Recent Activity */}
            <View style={tw`px-6 mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-xl font-bold text-gray-800`}>
                  Recent Budgets
                </Text>
                <Pressable onPress={() => navigation.navigate('profile/budgets/list')}>
                  <Text style={tw`text-blue-600`}>View All</Text>
                </Pressable>
              </View>
              
              {loading ? (
                <Text style={tw`text-gray-500 text-center py-4`}>Loading...</Text>
              ) : (
                budgets.slice(0, 3).map((budget) => (
                  <View key={budget.id} style={tw`bg-white rounded-xl shadow-sm p-4 mb-3`}>
                    <View style={tw`flex-row justify-between items-center`}>
                      <View>
                        <Text style={tw`font-semibold text-gray-800`}>
                          {budget.category_name}
                        </Text>
                        <Text style={tw`text-gray-500 text-sm`}>
                          ${budget.max_amount.toFixed(2)}
                        </Text>
                      </View>
                      <View style={tw`px-3 py-1 rounded-full ${
                        budget.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Text style={tw`${
                          budget.status === 'active' ? 'text-green-800' : 'text-red-800'
                        } font-medium`}>
                          {budget.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BudgetHomeScreen;