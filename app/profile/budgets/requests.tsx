import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { getBudgetRequests, deleteBudgetRequest } from '../../ts/budgets/budgetRequestService';
import { ProtectedRoute } from '../../AuthProvider';
import MainLayout from '../../components/MainLayout';
import tw from 'twrnc';

const BudgetRequestsScreen = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getBudgetRequests();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteBudgetRequest(id);
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={tw`bg-white rounded-xl shadow-sm p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {item.category_name}
        </Text>
        <View style={tw`flex-row gap-2`}>
          <Pressable
            onPress={() => navigation.navigate('profile/budgets/edit-request', { request: item })}
            style={tw`p-2`}
          >
            <Feather name="edit-2" size={20} color="#4B5563" />
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={tw`p-2`}
          >
            <Feather name="trash-2" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <Text style={tw`text-gray-600 mb-2`}>{item.description}</Text>

      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-semibold`}>
          ${item.requested_amount.toFixed(2)}
        </Text>
        <View style={tw`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text style={tw`font-medium capitalize`}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={tw`text-gray-500 text-sm mt-2`}>
        {new Date(item.request_date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
          <View style={tw`flex-1 p-4`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                Budget Requests
              </Text>
              <Pressable
                style={tw`bg-blue-600 py-2 px-4 rounded-xl`}
                onPress={() => navigation.navigate('profile/budgets/create-request')}
              >
                <Text style={tw`text-white font-semibold`}>New Request</Text>
              </Pressable>
            </View>

            <FlatList
              data={requests}
              renderItem={renderRequestItem}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={tw`flex-1 justify-center items-center py-8`}>
                  <Text style={tw`text-gray-500 text-lg`}>
                    {loading ? 'Loading...' : 'No budget requests available'}
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

export default BudgetRequestsScreen; 