import type React from "react"
import { View, Text, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ProtectedRoute } from "../AuthProvider"
import { onLogout } from "../ts/login_logic"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../AuthProvider"
import tw from "twrnc";
import MainLayout from "../components/MainLayout"

const DashboardScreen = ({ }) => {

  const navigation = useNavigation();
  const { logout } = useAuth();
  const handleLogout = () => {
    onLogout(navigation, logout)
  }

  return (
    <ProtectedRoute>
        <MainLayout>
            <SafeAreaView style={tw`flex-1`}>
              <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw``}>Bienvenido al Dashboard</Text>
                <Text style={tw``}>Has iniciado sesión correctamente</Text>
                <Pressable style={tw`bg-blue-500`} onPress={handleLogout}>
                  <Text style={tw`text-white text-xl font-bold`}>Cerrar sesión</Text>
                </Pressable>
              </View>
            </SafeAreaView>
        </MainLayout>
    </ProtectedRoute>
  )
}


export default DashboardScreen

