import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  BackHandler,
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import {homeBackgroundSound, tapSound} from '../..';
import {icons} from '../images';
import icon from '../images/icon';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  Sound.setCategory('Playback');
  const backgroundSound = useRef<Sound | null>();

  useEffect(() => {
    backgroundSound!.current = homeBackgroundSound;

    if (!isSoundMuted) {
      backgroundSound.current!.setVolume(0.15);
      backgroundSound.current!.setNumberOfLoops(-1);
      backgroundSound.current!.play(success => {
        if (!success) {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!backgroundSound.current!.isPlaying() && !isSoundMuted) {
        console.log('here');
        backgroundSound.current!.play();
      }

      return () => {
        backgroundSound.current!.stop();
        console.log('stopped and released');
      };
    }, []),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        console.log('background');
        backgroundSound.current!.pause();
      } else if (nextAppState === 'active') {
        console.log('active');
        backgroundSound.current!.play();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isSoundMuted) {
      console.log('muted');
      backgroundSound.current!.pause();
    } else {
      backgroundSound.current!.play();
    }
  }, [isSoundMuted]);

  useEffect(() => {
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPressed,
    );
    return () => backHandler.remove();
  }, []);

  const handleBackPressed = () => {
    setShowModal(true);
    return true;
  };

  const handleSoundPress = () => {
    setIsSoundMuted(prevState => !prevState);
    if (!isSoundMuted) {
      tapSound?.play();
    }
  };

  const handleModalClose = () => {
    if (!isSoundMuted) {
      tapSound.play();
    }
    setShowModal(false);
  };

  const handleExitGame = () => {
    if (!isSoundMuted) {
      tapSound.play();
    }
    backgroundSound.current!.stop();
    backgroundSound.current!.release();
    setShowModal(false);
    BackHandler.exitApp();
  };

  const handlePlayPress = () => {
    if (!isSoundMuted) {
      tapSound.play();
    }
    navigation.navigate('Game', {isSoundMuted});
  };

  const handleLeaderBoardPress = () => {
    if (!isSoundMuted) {
      tapSound.play();
    }
    setShowLeaderboardModal(true);
  };

  const handleQuestionPress = () => {
    if (!isSoundMuted) {
      tapSound.play();
    }
    setShowRulesModal(true);
  };

  const handleRateApp = async () => {
    !isSoundMuted && tapSound.play();
    const canOpenUrl = await Linking.canOpenURL(
      'market://details?id=com.moddsoft.snakegame',
    );
    if (canOpenUrl) {
      Linking.openURL('market://details?id=com.moddsoft.snakegame');
    }
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{position: 'absolute', top: 20, right: 20, zIndex: 1}}
        onPress={handleSoundPress}>
        <Image
          style={{height: 70, width: 70}}
          source={isSoundMuted ? icons.muted : icons.sound}
        />
      </TouchableOpacity>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={icons.home_background}
      />
      <View style={{flex: 1, alignItems: 'center', marginTop: 90}}>
        <Animated.Image
          style={{
            height: 150,
            width: 150,
            opacity: logoAnimation,
          }}
          source={icons.app_icon}
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Animated.Image
          style={{
            height: 200,
            width: 200,
            opacity: logoAnimation,
          }}
          source={icons.snake_img}
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity onPress={handlePlayPress}>
          <Image
            style={{
              height: 100,
              width: 150,
            }}
            source={icons.play_btn}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
        }}>
        <TouchableOpacity onPress={handleLeaderBoardPress}>
          <Image style={{height: 70, width: 70}} source={icons.leaderboard} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQuestionPress}>
          <Image style={{height: 70, width: 70}} source={icons.questions} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRateApp}>
          <Image style={{height: 70, width: 70}} source={icons.liked} />
        </TouchableOpacity>
      </View>

      {/* Leaderboard Modal */}
      <Modal visible={showLeaderboardModal} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowLeaderboardModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => setShowLeaderboardModal(false)}>
              <Image
                source={icon.leaderboard_menu}
                style={{height: 300, width: 350}}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rules Modal */}
      <Modal visible={showRulesModal} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowRulesModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => setShowRulesModal(false)}>
              <Image
                source={icon.rules_modal}
                style={{height: 300, width: 350}}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.exitModalContainer}>
          <Image source={icons.exit_menu} style={styles.modalImage} />
          <TouchableOpacity
            onPress={handleExitGame}
            style={styles.modaltickButton}>
            <View style={styles.buttonBackground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleModalClose}
            style={styles.modalcancelButton}>
            <View style={styles.buttonBackground} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  exitModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  modaltickButton: {
    position: 'absolute',
    top: '61%',
    left: '30%',
    width: 55,
  },
  modalcancelButton: {
    position: 'absolute',
    top: '61%',
    left: '57%',
    width: 55,
  },
  buttonBackground: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 5,
  },
});

export default Home;
