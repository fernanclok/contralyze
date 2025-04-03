import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getBudgets } from '../../ts/budgets/budgetService';
import { ProtectedRoute } from '../../AuthProvider';
import MainLayout from '../../components/MainLayout';
import BudgetCard from '../../components/Budget/BudgetCard';
import tw from 'twrnc';

const BudgetListScreen = () => {
  const navigation = useNavigation();
  const [budgets, setBudgets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBudgets();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={tw`flex-1`}>
          <View style={tw`flex-1 p-4`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                Budgets
              </Text>
              <Pressable
                style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
                onPress={() => navigation.navigate('profile/budgets/create')}
              >
                <Text style={tw`text-white font-semibold`}>New</Text>
              </Pressable>
            </View>

            <FlatList
              data={budgets}
              renderItem={({ item }) => <BudgetCard budget={item} />}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={tw`flex-1 justify-center items-center py-8`}>
                  <Text style={tw`text-gray-500 text-lg`}>
                    {loading ? 'Loading...' : 'No budgets available'}
                  </Text>
                </View>
              }
            />
          </View>
        </SafeAreaView>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BudgetListScreen; 