import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { Colors } from "../styles/colors";
import { icons } from "../images";

interface HeaderProps{
    reloadGame : () => void;
    pauseGame: () => void;
    children: JSX.Element;
    isPaused: boolean;
}

export default function Header ({
    children,
    reloadGame,
    pauseGame,
    isPaused
}: HeaderProps): JSX.Element {
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={reloadGame}>
                <Image source={icons.reload} style={{height:35,width:35}}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={pauseGame}>
            <Image source={isPaused? icons.play : icons.pause} style={{height:35,width:35}}/>
            </TouchableOpacity>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 0.05,
        flexDirection: "row",
        alignItems:'center',
        justifyContent:"space-between",
        borderColor:Colors.primary,
        borderWidth:12,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        borderBottomWidth:0,
        padding:15,
        backgroundColor:Colors.background,
    },
});