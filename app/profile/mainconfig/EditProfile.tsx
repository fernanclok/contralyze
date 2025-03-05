
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import tw from "twrnc"
import { ProtectedRoute } from "@/app/AuthProvider"
import MainLayout from "@/app/components/MainLayout"
import { showMessage } from "react-native-flash-message"
import { updateUserProfile } from "@/hooks/ts/manage_profile/Edit_profile"
import Constants from 'expo-constants';



export default function EditProfile() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


// Obtener perfil del usuario desde AsyncStorage
    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem("userInfo");
            if (!userProfile) return {};
            
            const parsedProfile = JSON.parse(userProfile);
            return {
                id: parsedProfile?.id || "",
                first_name: parsedProfile?.first_name || "",
                last_name: parsedProfile?.last_name || "",
                email: parsedProfile?.email || "",
                role: parsedProfile?.role || "",
                profilePicture: parsedProfile?.photo_profile_path || null,
                department_id: parsedProfile?.department_id || "",
            };
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return {};
        }
    };

    // Hook para manejar el perfil del usuario
    const [profile, setProfile] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        profilePicture: null,
        department_id: "",
    });

    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); // Nuevo estado para la imagen seleccionada

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setProfile(userProfile);
            } catch (error) {
                showMessage({
                    message: "Error",
                    description: "There was an error loading your profile",
                    type: "danger",
                });
            }
        };
        loadUserProfile();
    }, []);

    const handleChange = (key, value) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            [key]: value,
        }));
        
        if (errors[key]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: null,
            }));
        }
    };

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {};
        if (!profile.first_name) newErrors.first_name = "The name is required";
        if (!profile.last_name) newErrors.last_name = "The last name is required";
        if (!profile.email) newErrors.email = "The email is required";
        if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Invalid email";
        if (profile.first_name && !/^[a-zA-Z\s]*$/.test(profile.first_name)) newErrors.first_name = "Invalid name";
        if (profile.last_name && !/^[a-zA-Z\s]*$/.test(profile.last_name)) newErrors.last_name = "Invalid last name";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejo del envío del formulario
    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await updateUserProfile(profile);
            } catch (error) {
                showMessage({
                    message: "Error",
                    description: "There was an error updating your profile",
                    type: "danger",
                });
            }
        }
    };

    // Función para seleccionar imagen
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setSelectedImage(selectedAsset.uri); // Almacena la URI de la imagen seleccionada
            handleChange("profilePicture", selectedAsset.uri);
        }
    };

        const apiurl = Constants.expoConfig?.extra?.PHOTO_URL;

        if (!apiurl) {
            throw new Error('PHOTO_URL not found');
        }
    
  return (
    <ProtectedRoute>
        <MainLayout>
        <ScrollView style={tw`flex-1 bg-gray-100 py-16`}>
            <View style={tw`p-4`}>
                <View style={tw`items-center mb-6`}>
                <TouchableOpacity onPress={pickImage}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={tw`w-32 h-32 rounded-full`}
                    onError={(error) => console.log("Error loading image:", error.nativeEvent)}
                  />
                ) : profile.profilePicture ? (
                  <Image
                    source={{ uri: profile.profilePicture ? `${apiurl}${profile.profilePicture}` : '' }}
                    style={tw`w-32 h-32 rounded-full`}
                    onError={(error) => console.log("Error loading image:", error.nativeEvent)}
                  />
                ) : (
                  <View style={tw`w-32 h-32 rounded-full bg-gray-300 items-center justify-center`}>
                    <Ionicons name="camera" size={40} color="gray" />
                  </View>
                )}
                </TouchableOpacity>
                <Text style={tw`mt-2 text-blue-500`}>Change your profile picture</Text>
                </View>

                <View style={tw`mb-4`}>
                <Text style={tw`mb-1 text-gray-700`}>Name</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-md p-2 bg-white`}
                    value={profile.first_name}
                    onChangeText={(text) => handleChange("first_name", text)}
                    placeholder="Your Name"
                />
                {errors.first_name && <Text style={tw`text-red-500 text-sm mt-1`}>{errors.first_name}</Text>}
                </View>

                <View style={tw`mb-4`}>
                <Text style={tw`mb-1 text-gray-700`}>Last Name</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-md p-2 bg-white`}
                    value={profile.last_name}
                    onChangeText={(text) => handleChange("last_name", text)}
                    placeholder="Your Name"
                />
                {errors.last_name && <Text style={tw`text-red-500 text-sm mt-1`}>{errors.last_name}</Text>}
                </View>

                <View style={tw`mb-4`}>
                <Text style={tw`mb-1 text-gray-700`}>Email</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-md p-2 bg-white`}
                    value={profile.email}
                    onChangeText={(text) => handleChange("email", text)}
                    placeholder="you@email.com"
                    keyboardType="email-address"
                />
                {errors.email && <Text style={tw`text-red-500 text-sm mt-1`}>{errors.email}</Text>}
                </View>

                <View style={tw`mb-4`}>
                <Text style={tw`mb-1 text-gray-700`}>Role</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded-md p-2 bg-white`}
                    value={profile.role}
                    onChangeText={(text) => handleChange("role", text)}
                    placeholder="Your Role"
                    readOnly={true}
                />
                {errors.role && <Text style={tw`text-red-500 text-sm mt-1`}>{errors.role}</Text>}
                </View>

                <TouchableOpacity style={tw`bg-blue-500 p-3 rounded-md`} onPress={handleSubmit}>
                <Text style={tw`text-white text-center font-semibold`}>Save Change</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </MainLayout>
    </ProtectedRoute>
  )
}

