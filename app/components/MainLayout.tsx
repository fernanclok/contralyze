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
          flexDirection: 'row',
          backgroundColor: 'white',
        },
        content: {
          flex: 1,
        },
      });
      
      export default MainLayout;