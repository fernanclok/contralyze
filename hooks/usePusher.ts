import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { showMessage } from "react-native-flash-message";

// Definiciones de tipos
interface PusherEvent {
  title?: string;
  message?: string;
  [key: string]: any;
}

interface PusherHookResult {
  subscribeToChannel: (
    channelName: string,
    eventName: string,
    callback: (data: PusherEvent) => void
  ) => (() => void) | null;
  showLocalNotification: (title: string, body: string) => void;
}

const usePusher = (): PusherHookResult => {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null);

  useEffect(() => {
    const pusher = new Pusher("PUBLIC_PUSHER_KEY", {
      cluster: "PUBLIC_PUSHER_CLUSTER",
      forceTLS: true,
    });
    setPusherClient(pusher);

    return () => {
      if (pusherClient) {
        pusherClient.disconnect();
      }
    };
  }, []);

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

  const showLocalNotification = (title: string, body: string): void => {
    showMessage({
      message: title,
      description: body,
      type: "info",
      duration: 4000,
    });
  };

  return {
    subscribeToChannel,
    showLocalNotification,
  };
};

export { usePusher };