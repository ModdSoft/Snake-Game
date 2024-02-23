import "react-native-gesture-handler";
import Game from "./src/components/Game";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { Colors } from "./src/styles/colors";

const App = () => {
return(
   <GestureHandlerRootView style={{backgroundColor:Colors.primary,flex:1}}>
    <StatusBar backgroundColor={Colors.primary}/>
     <Game/>
   </GestureHandlerRootView>
)
};

export default App;