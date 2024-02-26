import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Image, Text, Modal, TouchableWithoutFeedback } from "react-native";
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
  const [isMenuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    if (!isPaused) {
      pauseGame();
    }
    setMenuVisible(true);
  };

  const handleReloadGame = () => {
    reloadGame();
    setMenuVisible(false);
  };

  const handleContinueGame = () => {
    setMenuVisible(false);
    pauseGame();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openMenu}>
        <Image source={icons.reload} style={styles.icon} />
      </TouchableOpacity>
      
      <View style={styles.scoreContainer}>
        <Image source={icons.plain_btn} style={styles.scoreImage} />
        <Text style={styles.scoreText}>{children}</Text>
      </View>
      
      <TouchableOpacity onPress={pauseGame}>
        <Image source={isPaused ? icons.resume_btn : icons.pause} style={styles.icon} />
      </TouchableOpacity>

      <Modal visible={isMenuVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <Image source={icons.reset_menu} style={styles.menuImage} />
            <TouchableOpacity onPress={handleReloadGame} style={styles.resetButton}>
            <View style={styles.buttonBackground}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleContinueGame} style={styles.continueButton}>
            <View style={styles.buttonBackground}/>
            </TouchableOpacity>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
    padding: 15,
  },
  icon: {
    marginTop: 45,
    height: 75,
    width: 75,
  },
  scoreContainer: {
    position: 'relative',
    marginTop: 25,
  },
  scoreImage: {
    height: 60,
    width: 120,
  },
  scoreText: {
    marginTop: 25,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -13 }, { translateY: -13 }],
    color: Colors.primary, 
    fontSize: 20, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuImage: {
    width: 300,
    height: 300,
  },
  resetButton: {
    position: "absolute",
    top: '61%',
    left: '30%',
    width: 55,
  },
  continueButton: {
    position: "absolute",
    top: '61%',
    left: '57%',
    width:55,
  },
  buttonIcon: {
    width: 50,
    height: 50,
  },
  buttonBackground: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 5,
  },
});
