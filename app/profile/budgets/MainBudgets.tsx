import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react";
import BudgetAdminScreen from "./AdminBudgets";
import UserBudgetRequestsScreen from "./UserBudgets";
import tw from "twrnc";

const MainBudgets: React.FC = () => {
      const navigation = useNavigation()
    
      useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, [navigation]);
    const route = useRoute();
    const { role } = route.params; // Obtén el rol desde los parámetros de navegación
  
    return (
      <ProtectedRoute>
        <MainLayout>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
            <div style={tw`p-4 flex-1 mt-12`}>
              {role === "admin" ? (
                <ScrollView style={tw`h-full`}>
                  <BudgetAdminScreen />
                </ScrollView>
              ) : (
                <ScrollView>
                  <UserBudgetRequestsScreen />
                </ScrollView>
              )}
            </div>
          </KeyboardAvoidingView>
        </MainLayout>
      </ProtectedRoute>
    );
  };
  
  export default MainBudgets;