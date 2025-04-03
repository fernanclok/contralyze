import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Pusher from 'pusher-js';
import Constants from 'expo-constants';

// Definiciones de tipos
interface PusherEvent {
  title?: string;
  message?: string;
  timestamp?: string;
  [key: string]: any;
}

interface PusherHookResult {
  subscribeToChannel: (channelName: string, eventName: string, callback: (data: PusherEvent) => void) => (() => void) | null;
  showLocalNotification: (title: string, body: string, data?: Record<string, any>) => Promise<void>;
  notificationPermission: boolean;
}

// Configurar el manejador de notificaciones para dispositivos móviles
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const usePusher = (): PusherHookResult => {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null);
  const [pushNotificationsClient, setPushNotificationsClient] = useState<any | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  // Inicializar Pusher
  useEffect(() => {
    // Verificar que las variables de entorno estén definidas
    const { PUBLIC_PUSHER_KEY, PUBLIC_PUSHER_CLUSTER } = Constants.manifest?.extra || {};
    if (!PUBLIC_PUSHER_KEY || !PUBLIC_PUSHER_CLUSTER) {
      console.error('Error: Las variables de entorno PUBLIC_PUSHER_KEY o PUBLIC_PUSHER_CLUSTER no están definidas.');
      throw new Error('Pusher key or cluster is not defined in environment variables.');
    }

    const pusher = new Pusher(PUBLIC_PUSHER_KEY, {
      cluster: PUBLIC_PUSHER_CLUSTER,
      forceTLS: true
    });
    
    setPusherClient(pusher);

    // Configurar permisos de notificación según la plataforma
    const setupNotifications = async (): Promise<void> => {
      if (Platform.OS === 'web') {
        // Para web, usamos la API del navegador
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission === 'granted');
          
          // Si estamos usando Pusher Beams para web
          if (permission === 'granted') {
            try {
              // Solo importamos en web para evitar errores en móvil
              const PushNotifications = require('@pusher/push-notifications-web').default;
              const beamsClient = new PushNotifications({
                instanceId: 'YOUR_PUSHER_BEAMS_INSTANCE_ID',
              });
              
              beamsClient.start()
                .then(() => beamsClient.addDeviceInterest('hello'))
                .then(() => {
                  console.log('Successfully registered and subscribed!');
                  setPushNotificationsClient(beamsClient);
                })
                .catch((error: Error) => console.error('Error with Pusher Beams:', error));
            } catch (error) {
              console.error('Error importing Pusher Beams:', error);
            }
          }
        }
      } else {
        // Para móvil, usamos expo-notifications
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          
          setNotificationPermission(finalStatus === 'granted');
        }
      }
    };

    setupNotifications();

    // Limpieza
    return () => {
      if (pusherClient) {
        pusherClient.disconnect();
      }
    };
  }, []);

  // Suscribirse a un canal de Pusher
  const subscribeToChannel = (
    channelName: string, 
    eventName: string, 
    callback: (data: PusherEvent) => void
  ): (() => void) | null => {
    if (!pusherClient) return null;
    
    const channel = pusherClient.subscribe(channelName);
    channel.bind(eventName, callback);
    
    return () => {
      channel.unbind(eventName, callback);
      pusherClient.unsubscribe(channelName);
    };
  };

  // Enviar notificación local basada en datos de Pusher
  const showLocalNotification = async (
    title: string, 
    body: string, 
    data: Record<string, any> = {}
  ): Promise<void> => {
    if (!notificationPermission) return;
    
    if (Platform.OS === 'web') {
      // Notificación web
      new Notification(title, {
        body,
        icon: '/icon.png', // Ruta a tu icono
        data
      });
    } else {
      // Notificación móvil con Expo
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data
        },
        trigger: null // Inmediatamente
      });
    }
  };

  return {
    subscribeToChannel,
    showLocalNotification,
    notificationPermission
  };
};

// Ejemplo de uso en un componente
const PusherNotificationExample: React.FC = () => {
  const { subscribeToChannel, showLocalNotification } = usePusher();
  
  useEffect(() => {
    // Suscribirse al canal de usuario (por ejemplo, con ID de usuario)
    const unsubscribe = subscribeToChannel('user-channel-123', 'new-notification', (data: PusherEvent) => {
      console.log('Recibido evento de Pusher:', data);
      
      // Mostrar notificación local basada en datos recibidos
      showLocalNotification(
        data.title || 'Nueva notificación',
        data.message || 'Has recibido una nueva notificación',
        data
      );
    });
    
    // Limpieza al desmontar
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToChannel, showLocalNotification]);
  
  return null; // Este componente solo maneja notificaciones
};

export default PusherNotificationExample;
export { usePusher };