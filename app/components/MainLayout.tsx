import React, { PropsWithChildren } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import BottomTabMenu from "./tabMenu";
import Header from "./header";

const MainLayout = ({ children }: PropsWithChildren<{}>) => {
  

    return (
        <SafeAreaView style={styles.container}>
            <Header/>
                <View style={styles.content}>{children}</View>
            <BottomTabMenu />
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical:16, // Agrega padding vertical para evitar que el header se esconda
      },
      content: {
        flex: 1,
      },
    });
      
      export default MainLayout;