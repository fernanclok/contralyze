import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import { onClient } from "../../../hooks/ts/clients/newClient";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import tw from "twrnc";

const ClientsScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const navigation = useNavigation();

  const validateName = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    if (filteredText !== text) {
      setNameError("El nombre no debe contener números ni caracteres especiales");
    } else {
      setNameError("");
    }
    setName(filteredText);
  };

  const validateEmail = (text: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(text)) {
      setEmailError("El email no es válido");
    } else {
      setEmailError("");
    }
    setEmail(text);
  };

  const validatePhone = (text: string) => {
    const regex = /^\d{10}$/;
    if (!regex.test(text)) {
      setPhoneError("El número de teléfono debe tener 10 dígitos");
    } else {
      setPhoneError("");
    }
    setPhone(text);
  };

  const validateAddress = (text: string) => {
    if (text.length === 0) {
      setAddressError("La dirección no puede estar vacía");
    } else {
      setAddressError("");
    }
    setAddress(text);
  };

  const handleSubmit = () => {
    if (!name || !email || !phone || !address) {
      showMessage({
        message: 'Please, fill in all fields',
        type: 'warning'
      });
      return;
    }
    if (nameError || emailError || phoneError || addressError) {
      showMessage({
        message: 'Please check the fields',
        type: 'warning'
      });
      return;
    }
    try {
      onClient(name, email, phone, address, navigation);
    } catch (err) {
      showMessage({
        message: 'Error to create the client',
        type: 'danger'
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
          <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
            <View style={tw`px-6 py-8 bg-white rounded-3xl mx-4 my-8 shadow-lg`}>
              <Text style={tw`text-3xl font-bold mb-6 text-center text-blue-500`}>Registro de Cliente</Text>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-1`}>Nombre</Text>
                <View style={tw`flex-row items-center border-b border-gray-300`}>
                  <Feather name="user" size={20} color="#8CB3E0" style={tw`mr-2`} />
                  <TextInput
                    style={tw`flex-1 py-2 text-base`}
                    placeholder="Ingrese su nombre completo"
                    value={name}
                    onChangeText={validateName}
                  />
                </View>
                {nameError ? <Text style={tw`text-red-500 text-xs`}>{nameError}</Text> : null}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-1`}>Email</Text>
                <View style={tw`flex-row items-center border-b border-gray-300`}>
                  <Feather name="mail" size={20} color="#8CB3E0" style={tw`mr-2`} />
                  <TextInput
                    style={tw`flex-1 py-2 text-base`}
                    placeholder="Ingrese su email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={validateEmail}
                  />
                </View>
                {emailError ? <Text style={tw`text-red-500 text-xs`}>{emailError}</Text> : null}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-1`}>Teléfono</Text>
                <View style={tw`flex-row items-center border-b border-gray-300`}>
                  <Feather name="phone" size={20} color="#8CB3E0" style={tw`mr-2`} />
                  <TextInput
                    style={tw`flex-1 py-2 text-base`}
                    placeholder="Ingrese su número de teléfono"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={validatePhone}
                  />
                </View>
                {phoneError ? <Text style={tw`text-red-500 text-xs`}>{phoneError}</Text> : null}
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-sm font-medium text-gray-600 mb-1`}>Dirección</Text>
                <View style={tw`flex-row items-center border-b border-gray-300`}>
                  <Feather name="map-pin" size={20} color="#8CB3E0" style={tw`mr-2`} />
                  <TextInput
                    style={tw`flex-1 py-2 text-base`}
                    placeholder="Ingrese su dirección"
                    value={address}
                    onChangeText={validateAddress}
                  />
                </View>
                {addressError ? <Text style={tw`text-red-500 text-xs`}>{addressError}</Text> : null}
              </View>

              <Pressable style={tw`bg-blue-600 py-3 px-4 rounded-xl shadow-md`} onPress={handleSubmit}>
                <Text style={tw`text-white text-center font-bold text-lg`}>Registrar Cliente</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ClientsScreen;
