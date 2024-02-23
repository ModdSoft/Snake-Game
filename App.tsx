import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";
import Game from "./src/components/Game";
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
      {loading ? (
         <StatusBar backgroundColor={"#000000"} />
      ) : (
         <StatusBar backgroundColor={Colors.primary} />
      )}
      
      {loading ? (
         <Splash/>
      ) : (
        <Game />
      )}
    </GestureHandlerRootView>
  );
};

export default App;
