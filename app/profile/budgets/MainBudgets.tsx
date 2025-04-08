import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react";
import BudgetAdminScreen from "./AdminBudgets";
import UserBudgetRequestsScreen from "./UserBudgets";
import tw from "twrnc";
// import { usePusher } from "@/hooks/usePusher";
// import { showMessage } from "react-native-flash-message";

const MainBudgets: React.FC = () => {
      const navigation = useNavigation()
      const route = useRoute();
      const { role } = route.params; // Obtén el rol desde los parámetros de navegación
      // const { subscribeToChannel } = usePusher();
    
      useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, [navigation]);
  
      // useEffect(() => {
      //   // Suscribirse al canal de presupuestos
      //   const unsubscribe = subscribeToChannel(
      //     "budgets-channel", // Nombre del canal
      //     "budget-status", // Nombre del evento
      //     (data) => {
      //       // Manejar el evento recibido
      //       const { budgetId, status } = data;
      //      showMessage({
      //         message: "Presupuesto actualizado",
      //         description: `El presupuesto con ID ${budgetId} ha cambiado a ${status}.`,
      //         type: "success",
      //       });
      //     }
      //   );
    
      //   return () => {
      //     if (unsubscribe) unsubscribe(); // Limpiar la suscripción al desmontar el componente
      //   };
      // }, [subscribeToChannel]);
    return (
      <ProtectedRoute>
        <MainLayout>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
            <View style={tw`p-4 flex-1 py-12`}>
              {role === "admin" ? (
                <View style={tw`h-full`}>
                  <BudgetAdminScreen />
                </View>
              ) : (
                <View>
                  <UserBudgetRequestsScreen />
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </MainLayout>
      </ProtectedRoute>
    );
  };
  
  export default MainBudgets;