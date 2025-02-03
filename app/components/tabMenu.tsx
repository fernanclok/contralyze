import { useState } from "react"
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import tw from "twrnc"

const menuItems = [
  {
    icon: "home",
    label: "Dashboard",
    route: "profile/dashboard",
    subItems: [],
  },
  {
    icon: "user",
    label: "Perfil",
    route: null,
    subItems: [
      { label: "Editar", route: "EditProfile" },
      { label: "Configuración", route: "Settings" },
    ],
  },
  {
    icon: "bell",
    label: "Notificaciones",
    route: "Notifications",
    subItems: [
      { label: "Mensajes", route: "Messages" },
      { label: "Alertas", route: "Alerts" },
    ],
  },
  {
    icon: "menu",
    label: "Más",
    route: null,
    subItems: [
        { label: "Ayuda", route: "Help" },
        { label: "Acerca de", route: "About" },
        { label: "Cerrar sesión", route: "Logout" },
      ],
  },
]

const BottomTabMenu = () => {
  const [activeTab, setActiveTab] = useState(null)
  const [submenuHeight] = useState(new Animated.Value(0))
  const navigation = useNavigation()

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
    }
  };

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white shadow-lg`}>
      <Animated.View style={[tw`w-full bg-gray-100`, { height: submenuHeight }]}>
        {activeTab !== null &&
          menuItems[activeTab].subItems.map((subItem, index) => (
            <TouchableOpacity
              key={index}
              style={tw`px-4 py-2 border-b border-gray-200`}
              onPress={() => handleNavigation(subItem.route)}
            >
              <Text style={tw`text-sm`}>{subItem.label}</Text>
            </TouchableOpacity>
          ))}
      </Animated.View>
      <View style={tw`flex-row justify-around`}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
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
            <Feather name={item.icon} size={24} color={activeTab === index ? "blue" : "black"} />
            <Text style={tw`text-xs mt-1 ${activeTab === index ? "text-blue-500" : "text-black"}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default BottomTabMenu

