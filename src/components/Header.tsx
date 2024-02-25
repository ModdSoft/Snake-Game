import { TouchableOpacity, StyleSheet, View, Image,Text } from "react-native";
import { Colors } from "../styles/colors";
import { icons } from "../images";

interface HeaderProps {
  reloadGame: () => void;
  pauseGame: () => void;
  children: JSX.Element;
  isPaused: boolean;
}

export default function Header({
  children,
  reloadGame,
  pauseGame,
  isPaused,
}: HeaderProps): JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={reloadGame}>
        <Image source={icons.reload} style={styles.icon} />
      </TouchableOpacity>
      
      <View style={styles.scoreContainer}>
        <Image source={icons.plain_btn} style={styles.scoreImage} />
        <Text style={styles.scoreText}>{children}</Text>
      </View>
      

      <TouchableOpacity onPress={pauseGame}>
        <Image source={isPaused ? icons.muted : icons.pause} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
 //   borderColor: Colors.primary,
 //   borderWidth: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
    padding: 15,
 //   backgroundColor: Colors.background,
  },
  icon: {
    marginTop:45,
    height: 75,
    width: 75,
  },
  scoreContainer: {
    position: 'relative',
    marginTop:25,
  },
  scoreImage: {
    height: 60,
    width: 120,
    
  },
  scoreText: {
    marginTop:25,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -13 }, { translateY: -13 }],
    color: Colors.primary, 
    fontSize: 20, 
  },
});