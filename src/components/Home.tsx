import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import { icons } from '../images';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();
    const logoAnimation = useRef(new Animated.Value(0)).current;
    const [isSoundMuted, setIsSoundMuted] = useState(false);

    useEffect(() => {
        Animated.timing(logoAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, []);

    const handleSoundPress = () => {
        // Toggle sound state
        setIsSoundMuted(prevState => !prevState);
    };

    const handlePlayPress = () => {
        navigation.navigate('Game');
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
                <Image style={{ height: 70, width: 70 }} source={icons.leaderboard} />
                <Image style={{ height: 70, width: 70 }} source={icons.questions} />
                <Image style={{ height: 70, width: 70 }} source={icons.liked} />
            </View>
        </View>
    );
};

export default Home;
