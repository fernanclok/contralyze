import { useState } from "react"
import { View, Text, Pressable, Animated, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { onLogout } from "../../hooks/ts/login_logic"
import { useAuth } from "../AuthProvider"
import tw from "twrnc"

const menuItems = [
  {
    icon: "home",
    label: "Dashboard",
    route: "profile/dashboard",
    subItems: [],
  },
  {
    icon: "users",
    label: "Clientes",
    route: null,
    subItems: [
        {label: 'New Client', route: 'profile/clients/client'},
        {label: 'Client List', route: 'profile/clients/clientList'}
    ],
  },
  {
    icon: "user",
    label: "Profile",
    route: null,
    subItems: [
      { label: "Editar", route: "EditProfile" },
      { label: "Configuración", route: "Settings" },
    ],
  },
  {
    icon: "bell",
    label: "Notification",
    route: null,
    subItems: [
      { label: "Messages", route: "Messages" },
      { label: "Alerts", route: "Alerts" },
    ],
  },
  {
    icon: "menu",
    label: "More",
    route: null,
    subItems: [
        { label: "Help", route: "Help" },
        { label: "About to", route: "About" },
        { label: "Cerrar sesión", route: "Logout" },
      ],
  },
]

const BottomTabMenu = () => {
  const [activeTab, setActiveTab] = useState(null)
  const [submenuHeight] = useState(new Animated.Value(0))
  const navigation = useNavigation()
const { logout } = useAuth();
  const handleLogout = () => {
    onLogout(navigation, logout)
  }
  const toggleSubmenu = (index) => {
    if (activeTab === index) {
      // Cerrar el submenú
      Animated.timing(submenuHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
      setActiveTab(null)
    } else {
      // Abrir el submenú
      setActiveTab(index)
      Animated.timing(submenuHeight, {
        toValue: menuItems[index].subItems.length * 40, // 40px por cada elemento del submenú
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }

  const handleNavigation = (route) => {
    if (route) {
      navigation.navigate(route);
    }else{
      console.log("No route defined")
    }
  };
  
  return (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white shadow-lg`}>
      <Animated.View style={[tw`w-full bg-gray-100`, { height: submenuHeight }]}>
        {activeTab !== null &&
          menuItems[activeTab].subItems.map((subItem, index) => (
            <Pressable
              key={index}
              style={tw`px-4 py-2 border-b border-gray-200`}
              onPress={() => {
                if (subItem.route === "Logout") {
                  handleLogout();
                } else {
                  handleNavigation(subItem.route);
                }
              }}
            >
              <Text style={tw`text-sm`}>{subItem.label}</Text>
            </Pressable>
          ))}
      </Animated.View>
      <View style={tw`flex-row justify-around`}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={tw`items-center py-2`}
            onPress={() => {
              if (item.route) {
                handleNavigation(item.route);
              } else {
                toggleSubmenu(index);
              }
            }}
          >
            {item.label === "Profile" ? (
                <Image source={require('../../assets/images/Contralyze.png')} style={tw`w-8 h-8`} />
            ) : (
                <Feather name={item.icon} size={24} color={activeTab === index ? "blue" : "black"} />
            )}
            <Text style={tw`text-xs mt-1 ${activeTab === index ? "text-blue-500" : "text-black"}`}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default BottomTabMenu

