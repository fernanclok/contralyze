import type React from "react";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { onLogin } from "../hooks/ts/login_logic";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "./AuthProvider";
import tw from "twrnc";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { usePusher } from "../hooks/usePusher";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LoginScreen = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const { login } = useAuth();
  const goToRegister = () => {
    navigation.navigate("register");
  };

  // Configuración de Pusher
  const { showLocalNotification, subscribeToChannel } = usePusher();

  useEffect(() => {
    // Subscribe to the user's notification channel
    const unsubscribeUserChannel = subscribeToChannel(
      "user-channel", // Replace with the corresponding channel
      "new-notification",
      (data) => {
        console.log("Notification received:", data);
        showLocalNotification(
          data.title || "New Notification",
          data.message || "You have received a new notification"
        );
      }
    );

    // Suscribirse al canal de presupuestos
    const unsubscribeBudgetChannel = subscribeToChannel(
      "budget-channel", // Channel for budgets
      "new-budget",
      (data) => {
      console.log("New budget created:", data);
      showLocalNotification(
        "New Budget",
        `A new budget has been created: ${data.budgetName || "Unnamed"}`
      );
      }
    );
    return () => {
      if (unsubscribeUserChannel) unsubscribeUserChannel();
      if (unsubscribeBudgetChannel) unsubscribeBudgetChannel();
    };
  }, [subscribeToChannel, showLocalNotification]);

  // Solicita permisos para notificaciones (versión simplificada)
  async function requestNotificationPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Notifications could not be enabled");
        return false;
      }
      return true;
        } else {
      Alert.alert(
        "You must use a physical device to receive notifications."
      );
      return false;
    }
  }

  // Envía una notificación local
  async function sendLocalNotification(title, body, seconds = 2) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: { seconds: seconds },
    });
  }

  useEffect(() => {
    // Configure push notifications
    const configureNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert("Push notifications could not be enabled.");
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);

        // Send the token to the backend
        await fetch(`${Constants.expoConfig?.extra?.API_URL}/register-push-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } else {
        Alert.alert("You must use a physical device to receive push notifications.");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    };

    configureNotifications();

    // Listener for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      console.log("Please fill in all fields");
      showMessage({
        message: "Please fill in all fields",
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      await onLogin(email, password, navigation, login);
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await sendLocalNotification("Welcome!", "You have successfully logged in.");
      }

      if (hasPermission) {
        await showLocalNotification(
          "Welcome!", 
          "You have successfully logged in."
        );
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      showMessage({
        message: "Login failed. Please check your credentials and try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ImageBackground
          source={require("../assets/images/back_login.jpeg")}
          style={styles.backgroundImage}
          blurRadius={6} // Difumina la imagen
          resizeMode="cover" // Ajusta la imagen según la pantalla
        >
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/Contralyze.png")}
                  style={{ width: 100, height: 100 }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather
                  name="mail"
                  size={24}
                  color="#4A90E2"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather
                  name="lock"
                  size={24}
                  color="#4A90E2"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#4A90E2"
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View style={tw`flex-row items-center justify-center gap-2`}>
                    <ActivityIndicator color="white" />
                    <Text style={styles.loginButtonText}>Loading</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </Pressable>

              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </Pressable>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <Pressable onPress={goToRegister}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 2,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Updated line
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 12,
    borderWidth: 0,
    borderColor: "transparent",
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#4A90E2",
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 13,
    color: "#333",
  },
  registerButtonText: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginScreen;
