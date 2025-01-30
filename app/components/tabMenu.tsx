import { useState } from "react"
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import tw from "twrnc"
import { linkTo } from "expo-router/build/global-state/routing"

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const slideAnim = useState(new Animated.Value(0))[0]
    const navigation = useNavigation()

  const toggleSidebar = () => {
    const toValue = isExpanded ? 0 : 200 // 200 es el ancho expandido, ajusta según necesites
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start()
    setIsExpanded(!isExpanded)
  }

  const menuItems = [
    { icon: "home", label: "Dashboard", link: "profile/dashboard" },
    { icon: "user", label: "Profile", link: "profile" },
    { icon: "settings", label: "Settings", link: "settings" },
    { icon: "help-circle", label: "Help", link: "help" },
  ]

  return (
    <Animated.View
      style={[
        tw`absolute top-0 left-0 h-full bg-white shadow-lg`,
        {
          width: slideAnim.interpolate({
            inputRange: [0, 200],
            outputRange: [64, 264], // 64px cuando está colapsado (solo iconos), 264px cuando está expandido
          }),
        },
      ]}
    >
      <TouchableOpacity style={tw`absolute top-10 left-4 z-50`} onPress={toggleSidebar}>
        <Feather name={isExpanded ? "chevron-left" : "chevron-right"} size={24} color="black" />
      </TouchableOpacity>
      <View style={tw`pt-20 px-2`}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`flex-row items-center py-4 ${isExpanded ? "px-2" : "justify-center"}`}
            onPress={() => navigation.navigate(item.link)}
          >
            <Feather name={item.icon} size={24} color="black" />
            {isExpanded && <Text style={tw`ml-4 text-lg`}>{item.label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
}

export default Sidebar

