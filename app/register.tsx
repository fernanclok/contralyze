import type React from "react"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { showMessage } from 'react-native-flash-message';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "./AuthProvider"
import { onRegister } from "./LoginTs/register"

const RegisterScreen = () => {

  const navigation = useNavigation();
  const { login } = useAuth();
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    letter: false,
    special: false,
  })

  const [emailCriteria, setEmailCriteria] = useState({
    valid: false,
  })

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_-]/.test(password),
    }
    const newEmailCriteria = {
      valid: /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.com$/.test(email),
    };
    
    setEmailCriteria(newEmailCriteria)

    setPasswordCriteria(newCriteria)

    const strength = Object.values(newCriteria).filter(Boolean).length
    setPasswordStrength(strength)

    setPasswordsMatch(password === confirmPassword && password !== "")
  }, [password, confirmPassword])

  const handleRegister = () => {
    if (password !== confirmPassword) {
      showMessage({
        message: "The passwords do not match",
        type: "danger",
      });
      return
    }
    if (passwordStrength < 4) {
      showMessage({
        message: "Error",
        description: "Please make sure the password meets all criteria",
        type: "danger",
        style: {
          height: 10, // Reduce la altura
          borderRadius: 8,
          marginHorizontal: 10, // Ajusta el margen horizontal
        },
      });
      return
    }
    if (!emailCriteria.valid) {
      showMessage({
        message: "Error",
        description: "Please make sure the email is valid",
        type: "danger",
        backgroundColor: '#ff4d4d', // background color
        color: '#fff', // text color
        // icon: { icon: 'danger', position: 'left' }, // icon
      });
      return;
    }
    onRegister(email, password, first_name, last_name, navigation, login)
  }

  const renderPasswordStrengthIndicator = () => (
    <View style={styles.strengthIndicator}>
      {[...Array(4)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.strengthBar,
            index < passwordStrength ? styles.activeStrengthBar : null,
            index < passwordStrength
              ? passwordStrength === 1
                ? styles.weakBar
                : passwordStrength === 2
                  ? styles.fairBar
                  : passwordStrength === 3
                    ? styles.goodBar
                    : styles.strongBar
              : null,
          ]}
        />
      ))}
    </View>
  )

  const handleNameChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z]/g, '');
    setter(filteredText);
  };

  const renderPasswordCriteria = () => {
    const criteriaText = []
    if (passwordCriteria.length) criteriaText.push("8+ characters")
    if (passwordCriteria.number) criteriaText.push("numbers")
    if (passwordCriteria.letter) criteriaText.push("letters")
    if (passwordCriteria.special) criteriaText.push("special characters")

    return (
      <Text style={styles.criteriaText}>
        {criteriaText.length > 0
          ? `Password contains: ${criteriaText.join(", ")}`
          : "Password must contain at least 8 characters, numbers, letters, and special characters"}
      </Text>
    )
  }


  const onBackToLogin = () => {
    navigation.navigate("index")
  }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
         <ImageBackground
                source={require('../assets/images/back_login.jpeg')} 
                style={styles.backgroundImage}
                blurRadius={8} // Difumina la imagen
                resizeMode="cover" // Ajusta la imagen según la pantalla
              >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/Contralyze.png')} style={{ width: 100, height: 100 }} />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="user" size={14} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={first_name}
              onChangeText={handleNameChange(setFirstName)}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputContainer}>
            <Feather name="user" size={14} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={last_name}
              onChangeText={handleNameChange(setLastName)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={14} color="#4A90E2" style={styles.inputIcon} />
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
            <Feather name="lock" size={14} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={14} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          
          {renderPasswordStrengthIndicator()}
          {renderPasswordCriteria()}

          <View style={styles.inputContainer}>
            <Feather name="lock" size={14} color="#4A90E2" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={14} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          {confirmPassword !== "" && (
            <Text style={[styles.matchText, passwordsMatch ? styles.matchSuccess : styles.matchError]}>
              {passwordsMatch ? "✓ The passwords do match" : "✗ The passwords don't match"}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.registerButton, (passwordStrength < 4 || !passwordsMatch) && styles.disabledButton]}
            onPress={handleRegister}
            disabled={passwordStrength < 4 || !passwordsMatch}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Have an account?</Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.loginButtonText}>Log in</Text>
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
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Updated line
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginTop: 10,
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
    fontSize: 14,
  },
  eyeIcon: {
    padding: 10,
  },
  strengthIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  strengthBar: {
    flex: 1,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeStrengthBar: {
    backgroundColor: "#4CAF50",
  },
  weakBar: {
    backgroundColor: "#FF5252",
  },
  fairBar: {
    backgroundColor: "#FFC107",
  },
  goodBar: {
    backgroundColor: "#4CAF50",
  },
  strongBar: {
    backgroundColor: "#2196F3",
  },
  matchText: {
    fontSize: 11,
    marginBottom: 5,
    textAlign: "center",
  },
  criteriaText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  matchSuccess: {
    color: "#4CAF50",
  },
  matchError: {
    color: "#FF5252",
  },
  registerButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  registerButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 13,
    color: "#333",
  },
  loginButtonText: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default RegisterScreen

