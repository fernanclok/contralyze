import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import Constants from 'expo-constants';
import tw from "twrnc";

const Header =() =>{
const navigation = useNavigation();
const [user, setUser] = useState({ firstName: '', lastName: '' });
const [photo, setPhoto] = useState('');

useEffect(() => {
    const getUserInfo = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setUser({ firstName: parsedUserInfo.first_name, lastName: parsedUserInfo.last_name });
            if (parsedUserInfo.photo_profile_path) {
                setPhoto(parsedUserInfo.photo_profile_path);
            }
        }
    }
    getUserInfo();
}, []);
    const userName  = user.firstName + ' ' + user.lastName;
    const handleback = () =>{
        navigation.navigate('profile/dashboard');
    }

    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName.charAt(0) + lastName.charAt(0);
    }
    const apiurl = Constants.expoConfig?.extra?.PHOTO_URL;

        if (!apiurl) {
            throw new Error('PHOTO_URL not found');
        }
    
        const url = `${apiurl}/${photo}`;

    return(
        <View style={[tw`absolute z-2 top-0 left-0 right-0 bg-white`, styles.header]}>
         <View style={tw`flex-row justify-between items-center px-4 mt-5 mb-2 w-full`}>
            <Pressable style={tw`` } onPress={handleback}>
                <Image
                source={require('../../assets/images/Contralyze.png')}
                style={tw`w-12 h-8`}
                />
            </Pressable>
                <View style={tw`flex-row items-center gap-2`}>
                <Text
            style={tw`text-black text-sm font-normal underline text-trunk w-32`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName}
          </Text>
                    {photo ? (
                        <Image
                        source={{ uri: photo.startsWith('http') || photo.startsWith('file') ? photo : url }}
                        style={tw`w-10 h-10 rounded-full`}
                        />
                    ) : (
                        <View style={tw`w-10 h-10 rounded-full bg-gray-300 items-center justify-center`}>
                            <Text style={tw`text-blue-500 text-lg`}>{getInitials(userName)}</Text>
                        </View>
                    )}
                </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    header: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2, // Sombra solo en la parte inferior
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // Para Android
    },
  });
export default Header;