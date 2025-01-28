import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ProtectedRoute } from "../AuthProvider"
import { onLogout } from "../LoginTs/login_logic"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../AuthProvider"

const DashboardScreen = ({ }) => {

  const navigation = useNavigation();
  const { logout } = useAuth();
  const handleLogout = () => {
    onLogout(navigation, logout)
  }

  return (
    <ProtectedRoute>
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido al Dashboard</Text>
        <Text style={styles.subtitle}>Has iniciado sesión correctamente</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ProtectedRoute>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default DashboardScreen

