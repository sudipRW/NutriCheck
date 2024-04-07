import React from 'react'
import { View,Text,StyleSheet,Image } from 'react-native'
import unhealthy from '../assets/giphy.gif'
import healthy from '../assets/smile.webp'
import moderate from '../assets/moderate.webp'

const Output = ({result}) => {
    const components = {
        'healthy': () => (
          <View style={styles.container}>
            <Image source={healthy} style={styles.img}/>
            <Text style={styles.healthyText}>It's Healthy</Text>
          </View>
        ),
        'unhealthy': () => (
          <View style={styles.container}> 
            <Image source={unhealthy} style={styles.img}/>
            <Text style={styles.unhealthyText}>It's Unhealthy</Text>
          </View>
        ),
        'moderate': () => (
          <View style={styles.container}>
            <Image source={moderate} style={styles.img}/>
            <Text style={styles.moderateText}>It's Moderate</Text>
          </View>
        )
      };
  
    const Component = components[result]
    return <Component />;
  
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        height: 400,
        width: 350,
        borderRadius: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, 
        backgroundColor: '#fff', 
        borderRadius: 10,
        margin: 40
    },
    img:{
        width: 300,
        height: 300,
    },
    healthyText:{
        color: 'green',
        fontSize: 30,
        fontWeight:'600',

    },
    unhealthyText:{
        color: 'red',
        fontSize: 30,
        fontWeight:'600',

    },
    moderateText:{
        color: '#ffb703',
        fontSize: 30,
        fontWeight:'600',

    },
})

export default Output