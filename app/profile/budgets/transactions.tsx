import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Modal, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createTransaction, getTransactions, deleteTransaction } from '../../ts/budgets/transactionService';
import { ProtectedRoute } from '../../AuthProvider';
import MainLayout from '../../components/MainLayout';
import tw from 'twrnc';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category_id: '',
    budget_id: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(selectedBudget);
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedBudget]);

  const handleCreateTransaction = async () => {
    try {
      await createTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        category_id: parseInt(newTransaction.category_id),
        budget_id: parseInt(newTransaction.budget_id)
      }, navigation);
      setModalVisible(false);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={tw`bg-white rounded-xl shadow-sm p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold ${item.type === 'income' ? 'text-green-800' : 'text-red-800'}`}>
          {item.type === 'income' ? '+' : '-'} ${item.amount}
        </Text>
        <Pressable
          onPress={() => handleDeleteTransaction(item.id)}
          style={tw`p-2`}
        >
          <Feather name="trash-2" size={20} color="#EF4444" />
        </Pressable>
      </View>

      <Text style={tw`text-gray-600`}>{item.description}</Text>
      
      <View style={tw`flex-row justify-between mt-2`}>
        <Text style={tw`text-gray-500`}>
          Category: {item.category_id}
        </Text>
        <Text style={tw`text-gray-500`}>
          {new Date(item.transaction_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <SafeAreaView style={tw`flex-1`}>
          <View style={tw`flex-1 p-4`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                Transactions
              </Text>
              <Pressable
                style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
                onPress={() => setModalVisible(true)}
              >
                <Text style={tw`text-white font-semibold`}>New Transaction</Text>
              </Pressable>
            </View>

            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id.toString()}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={fetchTransactions} 
                />
              }
              ListEmptyComponent={
                <Text style={tw`text-center text-gray-500`}>
                  No transactions found
                </Text>
              }
            />

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                <View style={tw`bg-white rounded-xl p-6 w-11/12 max-w-sm`}>
                  <Text style={tw`text-xl font-bold mb-4`}>New Transaction</Text>

                  <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2`}>Type</Text>
                    <View style={tw`flex-row gap-2`}>
                      <Pressable
                        style={tw`flex-1 py-2 px-4 rounded ${
                          newTransaction.type === 'income' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
                      >
                        <Text style={tw`text-center ${
                          newTransaction.type === 'income' ? 'text-white' : 'text-gray-700'
                        }`}>Income</Text>
                      </Pressable>
                      <Pressable
                        style={tw`flex-1 py-2 px-4 rounded ${
                          newTransaction.type === 'expense' ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                        onPress={() => setNewTransaction({...newTransaction, type: 'expense'})}
                      >
                        <Text style={tw`text-center ${
                          newTransaction.type === 'expense' ? 'text-white' : 'text-gray-700'
                        }`}>Expense</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2`}>Amount</Text>
                    <TextInput
                      style={tw`border rounded-lg p-2`}
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2`}>Description</Text>
                    <TextInput
                      style={tw`border rounded-lg p-2`}
                      placeholder="Transaction description"
                      value={newTransaction.description}
                      onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
                    />
                  </View>

                  <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2`}>Category ID</Text>
                    <TextInput
                      style={tw`border rounded-lg p-2`}
                      placeholder="Category ID"
                      value={newTransaction.category_id}
                      onChangeText={(text) => setNewTransaction({...newTransaction, category_id: text})}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2`}>Budget ID</Text>
                    <TextInput
                      style={tw`border rounded-lg p-2`}
                      placeholder="Budget ID"
                      value={newTransaction.budget_id}
                      onChangeText={(text) => setNewTransaction({...newTransaction, budget_id: text})}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={tw`flex-row justify-end gap-2`}>
                    <Pressable
                      style={tw`bg-gray-200 py-2 px-4 rounded-lg`}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
                      onPress={handleCreateTransaction}
                    >
                      <Text style={tw`text-white`}>Create</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TransactionsScreen; 