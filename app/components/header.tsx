import { View, Text, Image } from "react-native";
import { Pressable } from "react-native";
import tw from "twrnc";
import { useUser } from '../userContext';
import { useNavigation } from "expo-router";

const Header =() =>{
const navigation = useNavigation();
    const user = useUser();
    const handleback = () =>{
        navigation.navigate('profile/dashboard');
    }
    
    return(
        <View style={tw`absolute z-2 top-0 left-0 right-0 bg-white shadow-lg`}>
         <View style={tw`flex-row justify-between items-center px-6 py-2 w-full`}>
            <Pressable style={tw`` } onPress={handleback}>
                <Image
                source={require('../../assets/images/Contralyze.png')}
                style={tw`w-14=3 h-13`}
                />
            </Pressable>
                <Text style={tw`text-black text-lg font-bold `}>{user.firstName} {user.lastName}</Text>
        </View>
      </View>
    )
}


export default Header;