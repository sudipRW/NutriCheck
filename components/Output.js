import React from 'react'
import { View,Text,StyleSheet,Image } from 'react-native'
import unhealthy from '../assets/Bad.png'
import healthy from '../assets/Good.png'
import moderate from '../assets/Mod.png'

const Output = ({result}) => {
    const components = {
        'healthy': () => (
          <View style={styles.container}>
            <Image source={healthy} style={styles.img}/>
            <Text style={styles.healthyText}>Whoa!</Text>
            <Text style={[styles.healthyText,{fontSize: 20, textAlign: 'center'}]}>“Your balanced meal brings bliss to your body”</Text>
          </View>
        ),
        'unhealthy': () => (
          <View style={styles.container}> 
            <Image source={unhealthy} style={styles.img}/>
            <Text style={styles.unhealthyText}>Oops!</Text>
            <Text style={[styles.unhealthyText,{fontSize: 20, textAlign: 'center'}]}>“Processed food may lack essential nutrients”</Text>
          </View>
        ),
        'moderate': () => (
          <View style={styles.container}>
            <Image source={moderate} style={styles.img}/>
            <Text style={styles.moderateText}>Yaah!</Text>
            <Text style={[styles.moderateText,{fontSize: 20, textAlign: 'center'}]}>Small changes lead to big results!</Text>
          </View>
        )
      };
  
    const Component = components[result]
    return <Component />;
  
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        height: 400,
        width: 350,
        borderRadius: 20,
        gap: 10,
        position: 'absolute',
        right: '-27%',
        top: 250
    },
    img:{
        width: '100%',
        height: 80,
        objectFit: 'contain'
    },
    healthyText:{
        color: '#459D00',
        fontSize: 30,
        fontWeight:'600',

    },
    unhealthyText:{
        color: '#FF0000',
        fontSize: 30,
        fontWeight:'600',

    },
    moderateText:{
        color: '#F39123',
        fontSize: 30,
        fontWeight:'600',

    },
})

export default Output