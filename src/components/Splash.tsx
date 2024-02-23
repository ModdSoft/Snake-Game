import React from 'react';
import { View, Image } from 'react-native';
import { icons } from '../images';

const Splash = () => {
    return(
        <View style={{
            backgroundColor:"#000000", 
            flex:1,alignContent:'center',
            alignItems:'center',
            alignSelf:'center',
            justifyContent:'center'}}>
                <Image style={{height:400,width:400}} source={icons.logo}/>
        </View>
    )
}

export default Splash;