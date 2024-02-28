import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  AppState,
  AppStateStatus,
  BackHandler,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Sound from 'react-native-sound';
import { gameBackgroundSound, tapSound } from '../..';
import { icons } from '../images';
import { Colors } from '../styles/colors';
import { Coordinate, Direction, GestureEventType } from '../types/types';
import { checkEatsFood } from '../utils/checkEatsFood';
import { checkGameOver } from '../utils/checkGameOver';
import { randomFoodPosition } from '../utils/randomFoodPosition';
import Food from './Food';
import Header from './Header';
import Snake from './Snake';

const SNAKE_INITIAL_POSITION = [{x: 5, y: 5}];
const FOOD_INITIAL_POSITION = {x: 5, y: 20};
const GAME_BOUNDS = {xMin: 0, xMax: 30, yMin: 0, yMax: 60};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

type ParamList = {
  data: {
    isSoundMuted: boolean;
  };
};

export default function Game(): JSX.Element {
  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snake, setSnake] = React.useState<Coordinate[]>(
    SNAKE_INITIAL_POSITION,
  );
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const isSoundMuted =
    useRoute<RouteProp<ParamList, 'data'>>()?.params?.isSoundMuted;
  Sound.setCategory('Playback');
  const backgroundSound = useRef<Sound | null>();

  useEffect(() => {
    backgroundSound!.current = gameBackgroundSound;

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
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPressed,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [snake, isGameOver, isPaused]);

  const checkSnakeCollision = (head: Coordinate, snake: Coordinate[]) => {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = {...snakeHead};

    if (checkSnakeCollision(newHead, snake)) {
      setIsGameOver(true);
      return;
    }

    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      if (snakeHead.x === GAME_BOUNDS.xMin - 1) {
        newHead.x = GAME_BOUNDS.xMax;
      } else if (snakeHead.x === GAME_BOUNDS.xMax + 1) {
        newHead.x = GAME_BOUNDS.xMin;
      } else if (snakeHead.y === GAME_BOUNDS.yMin - 1) {
        newHead.y = GAME_BOUNDS.yMax;
      } else if (snakeHead.y === GAME_BOUNDS.yMax + 1) {
        newHead.y = GAME_BOUNDS.yMin;
      } else {
        setIsGameOver(true);
        return;
      }
    }
    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const handleGesture = (event: GestureEventType) => {
    const {translationX, translationY} = event.nativeEvent;
    console.log(translationX, translationY);
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  };

  const handleBackPressed = () => {
    setIsPaused(true);
    setShowModal(true);
    return true;
  };

  const playTapSound = () => {
    console.log('sound muted?', isSoundMuted);
    if (!isSoundMuted) {
      tapSound?.play();
    }
  };

  const handleModalClose = () => {
    playTapSound();
    setShowModal(false);
    setIsPaused(false);
  };

  const handleExitGame = () => {
    playTapSound();
    setShowModal(false);
    navigation?.goBack();
  };

  const handleRestartGame = () => {
    playTapSound();
    setIsGameOver(false);
    reloadGame();
  };

  return (
    <ImageBackground source={icons.background_temp} style={styles.background}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.container}>
          <Header
            isPaused={isPaused}
            pauseGame={pauseGame}
            reloadGame={reloadGame}
            isSoundMuted={isSoundMuted}>
            <Text
              style={{fontSize: 22, fontWeight: 'bold', color: Colors.primary}}>
              {score}
            </Text>
          </Header>
          <View style={styles.boundries}>
            <Snake snake={snake} />
            <Food x={food.x} y={food.y} />
          </View>
        </SafeAreaView>
      </PanGestureHandler>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
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
      <Modal visible={isGameOver} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={icons.game_over_menu} style={styles.modalImage} />
          <TouchableOpacity
            onPress={handleRestartGame}
            style={styles.modaltickButton}>
            <View style={styles.buttonBackground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExitGame}
            style={styles.modalcancelButton}>
            <View style={styles.buttonBackground} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  backgroundColor:Colors.primary,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  boundries: {
    flex: 1,
    borderColor: Colors.primary,
    // borderWidth:12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    //   backgroundColor:Colors.background,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeIcon: {
    width: 30,
    height: 30,
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
