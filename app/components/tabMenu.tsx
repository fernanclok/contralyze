import { SetStateAction, useState, useEffect } from "react";
import { View, Text, Pressable, Animated, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onLogout } from "../../hooks/ts/login_logic";
import { useAuth } from "../AuthProvider";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const menuItems = [
  {
    icon: "home",
    label: "Dashboard",
    route: "profile/dashboard",
    subItems: [],
  },

  {
    icon: "dollar-sign",
    label: "Budgets",
    route: null,
    subItems: [
      { label: "Manage Budgets", route: "profile/budgets/MainBudgets" },
    ],
  },
  {
    icon: "user",
    label: "Profile",
    route: null,
    subItems: [
      { label: "Edit Profile", route: "profile/mainconfig/EditProfile" },
      { label: "Manage Company", route: "profile/mainconfig/companyManagement" },
    ],
  },
  {
    icon: "bell",
    label: "Notification",
    route: null,
    subItems: [
      { label: "Alerts", route: "Alerts" },
    ],
  },
  {
    icon: "log-out",
    label: "Logout",
    route: "Logout",
    subItems: [],
  },
];

const BottomTabMenu = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [submenuHeight] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [role, setRole] = useState<string | null>(null); // Estado para almacenar el rol

  // Obtener el rol desde localStorage
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem("userInfo"); // Espera a que se resuelva la promesa
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo); // Parsea el JSON almacenado
          console.log("Stored user info:", parsedUserInfo);
          setRole(parsedUserInfo.role); // Establece el rol desde los datos almacenados
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
  
    fetchUserInfo();
  }, []);


  const handleLogout = () => {
    onLogout(navigation, logout);
  };

  const toggleSubmenu = (index: number | SetStateAction<null>) => {
    if (activeTab === index) {
      // Cerrar el submenú
      Animated.timing(submenuHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setActiveTab(null);
    } else {
      // Abrir el submenú
      setActiveTab(index);
      Animated.timing(submenuHeight, {
        toValue: menuItems[index].subItems.length * 40, // 40px por cada elemento del submenú
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleNavigation = (route) => {
    if (route) {
      if (route === "Logout") {
        handleLogout();
      } else {
        navigation.navigate(route, { role }); // Pasar el rol como parámetro
      }
    } else {
      console.log("No route defined");
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
                handleNavigation(subItem.route);
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
};

export default BottomTabMenu;

