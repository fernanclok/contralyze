import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import tw from "twrnc";

const Header =() =>{
const navigation = useNavigation();
const [user, setUser] = useState({ firstName: '', lastName: '' });
useEffect(() => {
    const getUserInfo = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setUser({ firstName: parsedUserInfo.first_name, lastName: parsedUserInfo.last_name });
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
    
    return(
        <View style={tw`absolute z-2 top-0 left-0 right-0 bg-white shadow-lg`}>
         <View style={tw`flex-row justify-between items-center px-6 py-2 w-full`}>
            <Pressable style={tw`` } onPress={handleback}>
                <Image
                source={require('../../assets/images/Contralyze.png')}
                style={tw`w-12 h-8`}
                />
            </Pressable>
                <View style={tw`flex-row items-center gap-2`}>
                    <Text style={tw`text-blue-500 text-sm font-bold  rounded-full p-2 bg-gray-300 `}>{getInitials(userName)}</Text>
                    <Text style={tw`text-black text-base font-normal`}>{userName}</Text>
                </View>
        </View>
      </View>
    )
}


export default Header;