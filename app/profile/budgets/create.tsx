import React, { useState } from 'react';
import { View, TextInput, ScrollView, Pressable, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createBudget } from '../../ts/budgets/budgetService';
import { ProtectedRoute } from '../../AuthProvider';
import MainLayout from '../../components/MainLayout';
import tw from 'twrnc';

const CreateBudgetScreen = () => {
  const navigation = useNavigation();
  const [categoryId, setCategoryId] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryId || !maxAmount || !startDate || !endDate) {
      showMessage({
        message: 'Please complete all fields',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      await createBudget({
        category_id: parseInt(categoryId),
        max_amount: parseFloat(maxAmount),
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active'
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
          <ScrollView style={tw`flex-1`}>
            {/* Header */}
            <View style={tw`px-6 py-18 bg-white shadow-sm`}>
              <Text style={tw`text-3xl font-bold text-gray-800`}>
                Create New Budget
              </Text>
              <Text style={tw`text-gray-500 mt-2`}>
                Set up your budget limits and tracking period
              </Text>
            </View>

            {/* Form Container */}
            <View style={tw`p-6`}>
              <View style={tw`bg-white rounded-2xl shadow-md p-6 space-y-6`}>
                {/* Category Input */}
                <View>
                  <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                    Category
                  </Text>
                  <View style={tw`relative`}>
                    <View style={tw`absolute left-4 top-3.5 z-10`}>
                      <Feather name="tag" size={20} color="#6B7280" />
                    </View>
                    <TextInput
                      style={tw`bg-gray-50 text-gray-900 text-lg rounded-xl pl-12 pr-4 py-3 w-full border border-gray-200`}
                      placeholder="Select category"
                      value={categoryId}
                      onChangeText={setCategoryId}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Amount Input */}
                <View>
                  <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                    Maximum Amount
                  </Text>
                  <View style={tw`relative`}>
                    <View style={tw`absolute left-4 top-3.5 z-10`}>
                      <Feather name="dollar-sign" size={20} color="#6B7280" />
                    </View>
                    <TextInput
                      style={tw`bg-gray-50 text-gray-900 text-lg rounded-xl pl-12 pr-4 py-3 w-full border border-gray-200`}
                      placeholder="0.00"
                      value={maxAmount}
                      onChangeText={setMaxAmount}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* Date Range */}
                <View>
                  <Text style={tw`text-gray-700 text-lg font-semibold mb-2`}>
                    Budget Period
                  </Text>
                  <View style={tw`space-y-4`}>
                    <View style={tw`relative`}>
                      <View style={tw`absolute left-4 top-3.5 z-10`}>
                        <Feather name="calendar" size={20} color="#6B7280" />
                      </View>
                      <TextInput
                        style={tw`bg-gray-50 text-gray-900 text-lg rounded-xl pl-12 pr-4 py-3 w-full border border-gray-200`}
                        placeholder="Start Date (YYYY-MM-DD)"
                        value={startDate.toISOString().split('T')[0]}
                        onChangeText={(text) => {
                          const date = new Date(text);
                          if (!isNaN(date.getTime())) {
                            setStartDate(date);
                          }
                        }}
                      />
                    </View>
                    <View style={tw`relative`}>
                      <View style={tw`absolute left-4 top-3.5 z-10`}>
                        <Feather name="calendar" size={20} color="#6B7280" />
                      </View>
                      <TextInput
                        style={tw`bg-gray-50 text-gray-900 text-lg rounded-xl pl-12 pr-4 py-3 w-full border border-gray-200`}
                        placeholder="End Date (YYYY-MM-DD)"
                        value={endDate.toISOString().split('T')[0]}
                        onChangeText={(text) => {
                          const date = new Date(text);
                          if (!isNaN(date.getTime())) {
                            setEndDate(date);
                          }
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={tw`mt-6 ${loading ? 'opacity-70' : ''}`}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <View style={tw`bg-blue-600 rounded-xl py-4 px-6`}>
                    <Text style={tw`text-white text-center font-bold text-lg`}>
                      {loading ? 'Creating...' : 'Create Budget'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default CreateBudgetScreen; 