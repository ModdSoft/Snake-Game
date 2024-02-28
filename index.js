/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Sound from 'react-native-sound';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

const tapSound = new Sound('button_tap_sound.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Failed to load tap sound', error);
    return;
  }
});

const gameBackgroundSound = new Sound(
  'background_game.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load game sound', error);
      return;
    }
  },
);

const homeBackgroundSound = new Sound(
  'background_home.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load home sound', error);
      return;
    }
  },
);

export {gameBackgroundSound, homeBackgroundSound, tapSound};
