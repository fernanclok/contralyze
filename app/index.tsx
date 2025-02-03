import type React from "react"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Image
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { onLogin } from "./LoginTs/login_logic"
import { showMessage } from "react-native-flash-message"
import { useAuth } from "./AuthProvider"
import tw from "twrnc"


const LoginScreen = ({  }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  
    const navigation = useNavigation();
    const { login } = useAuth();
    const goToRegister = () => {  navigation.navigate('register') }
  
   
  const handleLogin = () => {
    if(!email || !password) {
      setError("Please fill in all fields")
      console.log("Please fill in all fields")
      showMessage({
        message: 'Please fill in all fields',
        type: 'warning'
      })
    
      return
    }
  
    setLoading(true)
    setError(null)
    try{
       onLogin(email, password, navigation, login)
    }catch(err){
      setError("Login failed. Please check your credentials and try again.")
      showMessage({
        message: 'Login failed. Please check your credentials and try again.',
        type: 'danger'
      })
    }finally{
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ImageBackground
        source={require('../assets/images/back_login.jpeg')} 
        style={styles.backgroundImage}
        blurRadius={6} // Difumina la imagen
        resizeMode="cover" // Ajusta la imagen según la pantalla
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/Contralyze.png')} style={{ width: 100, height: 100 }} />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={24} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center", 
    width: "100%",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", 
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Updated line
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 12,
    borderWidth: 0,
    borderColor: "transparent", 
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#4A90E2",
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 13,
    color: "#333",
  },
  registerButtonText: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default LoginScreen

