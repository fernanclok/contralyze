import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface BudgetCardProps {
  budget: {
    id: number;
    category_id: number;
    category_name: string;
    max_amount: number;
    remaining_amount: number;
    start_date: string;
    end_date: string;
    status: string;
    spent: number;
  };
}

const BudgetCard = ({ budget }: BudgetCardProps) => {
  const spentPercentage = (budget.spent / budget.max_amount) * 100;

  return (
    <View style={tw`bg-white rounded-xl shadow-sm p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {budget.category_name}
        </Text>
        <View style={tw`px-2 py-1 rounded-full ${
          budget.status === 'active' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Text style={tw`${
            budget.status === 'active' ? 'text-green-800' : 'text-red-800'
          }`}>
            {budget.status}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-between mb-2`}>
        <Text style={tw`text-gray-600`}>Maximum Amount:</Text>
        <Text style={tw`font-semibold`}>${budget.max_amount.toFixed(2)}</Text>
      </View>

      <View style={tw`flex-row justify-between mb-2`}>
        <Text style={tw`text-gray-600`}>Spent:</Text>
        <Text style={tw`font-semibold text-red-600`}>${budget.spent.toFixed(2)}</Text>
      </View>

      <View style={tw`flex-row justify-between mb-4`}>
        <Text style={tw`text-gray-600`}>Remaining:</Text>
        <Text style={tw`font-semibold ${
          budget.remaining_amount < 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          ${budget.remaining_amount.toFixed(2)}
        </Text>
      </View>

      <View style={tw`bg-gray-200 h-2 rounded-full overflow-hidden mb-2`}>
        <View 
          style={[
            tw`h-full ${spentPercentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`,
            { width: `${Math.min(spentPercentage, 100)}%` }
          ]}
        />
      </View>

      <View style={tw`flex-row justify-between mt-2`}>
        <Text style={tw`text-gray-500 text-sm`}>
          {new Date(budget.start_date).toLocaleDateString()}
        </Text>
        <Text style={tw`text-gray-500 text-sm`}>
          {new Date(budget.end_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default BudgetCard; 