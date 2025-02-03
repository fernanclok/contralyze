import React, { PropsWithChildren } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Sidebar from "./tabMenu";

const MainLayout = ({ children }: PropsWithChildren<{}>) => {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.content}>{children}</View>
        <Sidebar />
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'white',
        },
        content: {
          flex: 1,
        },
      });
      
      export default MainLayout;