import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { icons } from '../images';
import { useNavigation } from '@react-navigation/native';
import icon from '../images/icon';
import Sound from 'react-native-sound';
import sounds from '../sounds';

const Home = () => {
    const navigation = useNavigation();
    const logoAnimation = useRef(new Animated.Value(0)).current;
    const [isSoundMuted, setIsSoundMuted] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const backgroundSound = useRef<Sound | null>(null);

    const tapSound = new Sound(sounds.button_tap, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('Failed to load the sound', error);
            return;
        }
    });

    useEffect(() => {
        backgroundSound.current = new Sound(sounds.home_bg, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            if (!isSoundMuted) {
                //NOT WORKING!!
                backgroundSound.current?.setNumberOfLoops(-1);
                backgroundSound.current?.play();
            }
        });
        return () => {
            if (backgroundSound.current) {
                backgroundSound.current.stop();
                backgroundSound.current.release(); 
            }
        };
    }, []);

    useEffect(() => {
        if (backgroundSound.current) {
            if (isSoundMuted) {
                backgroundSound.current.pause();
            } else {
                backgroundSound.current.play(); 
            }
        }
    }, [isSoundMuted]);

    useEffect(() => {
        Animated.timing(logoAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, []);

    const handleSoundPress = () => {
        setIsSoundMuted(prevState => !prevState);
        if (!isSoundMuted) {
            tapSound.play(); 
        }
    };

    const handlePlayPress = () => {
        if (!isSoundMuted) {
            tapSound.play(); 
        }
        navigation.navigate('Game');
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

    const handleLikedPress = () => {
        if (!isSoundMuted) {
            tapSound.play(); 
        }
        // Handle liked press
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }} onPress={handleSoundPress}>
                <Image style={{ height: 70, width: 70 }} source={isSoundMuted ? icons.muted : icons.sound} />
            </TouchableOpacity>
            <Image style={{ width: '100%', height: '100%', position: 'absolute' }} source={icons.home_background} />
            <View style={{ flex: 1, alignItems: 'center', marginTop: 90 }}>
                <Animated.Image
                    style={{
                        height: 150,
                        width: 150,
                        opacity: logoAnimation
                    }}
                    source={icons.app_icon}
                />
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Animated.Image
                    style={{
                        height: 200,
                        width: 200,
                        opacity: logoAnimation
                    }}
                    source={icons.snake_img}
                />
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity onPress={handlePlayPress}>
                    <Image style={{
                            height: 100,
                            width: 150
                        }}
                        source={icons.play_btn}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <TouchableOpacity onPress={handleLeaderBoardPress}>
                    <Image style={{ height: 70, width: 70 }} source={icons.leaderboard} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleQuestionPress}>
                    <Image style={{ height: 70, width: 70 }} source={icons.questions} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLikedPress}>
                    <Image style={{ height: 70, width: 70 }} source={icons.liked} />
                </TouchableOpacity>
            </View>

            {/* Leaderboard Modal */}
            <Modal visible={showLeaderboardModal} animationType='fade' transparent>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLeaderboardModal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => setShowLeaderboardModal(false)}>
                            <Image source={icon.leaderboard_menu} style={{ height: 300, width: 350 }}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Rules Modal */}
            <Modal visible={showRulesModal} animationType='fade' transparent>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowRulesModal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => setShowRulesModal(false)}>
                            <Image source={icon.rules_modal} style={{ height: 300, width: 350 }}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
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
});

export default Home;
