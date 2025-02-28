"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { showMessage } from "react-native-flash-message"
import tw from "twrnc"
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  useWindowDimensions,

} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "./AuthProvider"
import { onRegister } from "../hooks/ts/register"

const RegisterScreen = () => {
  const navigation = useNavigation()
  const { login } = useAuth()
  const { width } = useWindowDimensions()

  // Company State
  const [company_name, setCompanyName] = useState("")
  const [company_email, setCompanyEmail] = useState("")
  const [company_size, setCompanySize] = useState("")
  const [company_phone, setCompanyPhone] = useState("")
  const [company_address, setCompanyAddress] = useState("")
  const [company_city, setCompanyCity] = useState("")
  const [company_state, setCompanyState] = useState("")
  const [company_zip, setCompanyZip] = useState("")

  // User State
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

  // Step State
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>_-]/.test(password),
    }
    const newEmailCriteria = {
      valid: /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.com$/.test(email),
    }

    setEmailCriteria(newEmailCriteria)
    setPasswordCriteria(newCriteria)
    const strength = Object.values(newCriteria).filter(Boolean).length
    setPasswordStrength(strength)
    setPasswordsMatch(password === confirmPassword && password !== "")
  }, [password, confirmPassword, email])

  const handleRegister = () => {
    if (password !== confirmPassword) {
      showMessage({
        message: "The passwords do not match",
        type: "danger",
      })
      return
    }
    if (passwordStrength < 4) {
      showMessage({
        message: "Error",
        description: "Please make sure the password meets all criteria",
        type: "danger",
        style: {
          height: 10,
          borderRadius: 8,
          marginHorizontal: 10,
        },
      })
      return
    }
    if (!emailCriteria.valid) {
      showMessage({
        message: "Error",
        description: "Please make sure the email is valid",
        type: "danger",
        backgroundColor: "#ff4d4d",
        color: "#fff",
      })
      return
    }
    onRegister(email, password, first_name, last_name, navigation, company_name, company_email, company_size, company_phone, company_address, company_city, company_state, company_zip, login)
  }

  const renderPasswordStrengthIndicator = () => (
    <View style={tw`flex-row justify-between mb-3`}>
      {[...Array(4)].map((_, index) => (
        <View
          key={index}
          style={tw`flex-1 h-0.5 mx-0.5 rounded ${
            index < passwordStrength
              ? passwordStrength === 1
                ? "bg-red-500"
                : passwordStrength === 2
                  ? "bg-yellow-500"
                  : passwordStrength === 3
                    ? "bg-green-500"
                    : "bg-blue-500"
              : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  )

  const handleNameChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z\s]/g, "")
    setter(filteredText)
  }

  const renderPasswordCriteria = () => {
    const criteriaText = []
    if (passwordCriteria.length) criteriaText.push("8+ characters")
    if (passwordCriteria.number) criteriaText.push("numbers")
    if (passwordCriteria.letter) criteriaText.push("letters")
    if (passwordCriteria.special) criteriaText.push("special characters")

    return (
      <Text style={tw`text-xs text-gray-600 text-center mb-2.5`}>
        {criteriaText.length > 0
          ? `Password contains: ${criteriaText.join(", ")}`
          : "Password must contain at least 8 characters, numbers, letters, and special characters"}
      </Text>
    )
  }

  const onBackToLogin = () => {
    navigation.navigate("index")
  }

  const renderCompanyForm = () => (
    <>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-2`}>
          <InputField icon="briefcase" placeholder="Company Name" value={company_name} onChangeText={setCompanyName} rightIcon={undefined} />
        </View>
        <View style={tw`flex-1 ml-2`}>
          <InputField icon="users" placeholder="Company Size" value={company_size} onChangeText={setCompanySize} rightIcon={undefined}/>
        </View>
      </View>

      <InputField
        icon="mail"
        placeholder="Company Email"
        value={company_email}
        onChangeText={setCompanyEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        rightIcon={undefined}
      />

      <InputField
        icon="phone"
        placeholder="Company Phone"
        value={company_phone}
        onChangeText={setCompanyPhone}
        keyboardType="phone-pad"
        rightIcon={undefined}
      />

      <InputField
        icon="map-pin"
        placeholder="Company Address"
        value={company_address}
        onChangeText={setCompanyAddress}
        rightIcon={undefined}
      />

        <View style={tw`flex-1 mr-2`}>
          <InputField icon="map-pin" placeholder="City" value={company_city} onChangeText={setCompanyCity} rightIcon={undefined}/>
          
        </View>
        <View style={tw`flex-1 mx-2`}>
          <InputField icon="map-pin" placeholder="State" value={company_state} onChangeText={setCompanyState} rightIcon={undefined}/>
        </View>
        <View style={tw`flex-1 ml-2`}>
          <InputField
            icon="map-pin"
            placeholder="ZIP"
            value={company_zip}
            onChangeText={setCompanyZip}
            keyboardType="numeric"
            rightIcon={undefined}
          />
        </View>
      <Pressable
        style={tw`bg-blue-500 rounded-lg h-8.5 justify-center items-center mt-2.5`}
        onPress={() => setCurrentStep(2)}
      >
        <Text style={tw`text-white font-bold text-sm`}>Next</Text>
      </Pressable>
    </>
  )

  const renderUserForm = () => (
    <>
      <InputField
        icon="user"
        placeholder="First name"
        value={first_name}
        onChangeText={handleNameChange(setFirstName)}
        autoCapitalize="words"
        rightIcon={undefined}
      />
      <InputField
        icon="user"
        placeholder="Last name"
        value={last_name}
        onChangeText={handleNameChange(setLastName)}
        autoCapitalize="words"
        rightIcon={undefined}
      />
      <InputField
        icon="mail"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        rightIcon={undefined}
      />
      <InputField
        icon="lock"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        rightIcon={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={14} color="#4A90E2" />
          </Pressable>
        }
      />

      {renderPasswordStrengthIndicator()}
      {renderPasswordCriteria()}

      <InputField
        icon="lock"
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword}
        rightIcon={
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={14} color="#4A90E2" />
          </Pressable>
        }
      />
      {confirmPassword !== "" && (
        <Text style={tw`text-xs mb-1.25 text-center ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
          {passwordsMatch ? "✓ The passwords do match" : "✗ The passwords don't match"}
        </Text>
      )}

      <Pressable
        style={tw`bg-blue-500 rounded-lg h-8.5 justify-center items-center mt-2.5 ${
          passwordStrength < 4 || !passwordsMatch ? "bg-gray-400" : ""
        }`}
        onPress={handleRegister}
        disabled={passwordStrength < 4 || !passwordsMatch}
      >
        <Text style={tw`text-white font-bold text-sm`}>Register</Text>
      </Pressable>
      <Pressable
        style={tw`bg-blue-500 rounded-lg h-8.5 justify-center items-center mt-2.5`}
        onPress={() => setCurrentStep(1)}
      >
        <Text style={tw`text-white font-bold text-sm`}>Previous</Text>
      </Pressable>
    </>
  )

  return (
    <SafeAreaView style={tw`flex-1`}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
        <ImageBackground
          source={require("../assets/images/back_login.jpeg")}
          style={tw`flex-1 w-full h-full`}
          blurRadius={8}
          resizeMode="cover"
        >
          <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center p-5`}>
            <View style={tw`w-full max-w-lg p-5 bg-white rounded-lg shadow-md`}>
              <View style={tw`items-center mb-10`}>
                <Image source={require("../assets/images/Contralyze.png")} style={tw`w-15 h-15`} />
              </View>

              <Text style={tw`text-base font-bold text-center mb-5 text-blue-500`}>Step {currentStep} of 2</Text>

              {currentStep === 1 ? renderCompanyForm() : renderUserForm()}

              <View style={tw`flex-row justify-center mt-5`}>
                <Text style={tw`text-sm text-gray-700`}>Have an account?</Text>
                <Pressable onPress={onBackToLogin}>
                  <Text style={tw`text-sm text-blue-500 font-bold ml-1`}>Log in</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const InputField = ({ icon, rightIcon, ...props }) => (
  <View style={tw`flex-row items-center bg-white rounded-lg mb-3.75 px-2.5 shadow-sm`}>
    <Feather name={icon} size={14} color="#4A90E2" style={tw`mr-2.5`} />
    <TextInput style={tw`flex-1 h-12.5 text-sm`} {...props} />
    {rightIcon}
  </View>
)

export default RegisterScreen

