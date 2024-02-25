import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; 
import RootStack from "./navigation/RootStack";
import { Colors } from "./src/styles/colors";
import Splash from "./src/components/Splash";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timeout); 
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor: Colors.primary, flex: 1 }}>
      <StatusBar backgroundColor={loading ? "#000000" : Colors.primary} />
      {loading ? (
         <Splash/>
      ) : (
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      )}
    </GestureHandlerRootView>
  );
};

export default App;
