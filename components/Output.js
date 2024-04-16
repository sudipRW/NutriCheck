import React,{useState,useEffect} from 'react'
import { View,Text,StyleSheet,Image } from 'react-native'
import unhealthy from '../assets/BadReaction.png'
import healthy from '../assets/GoodReaction.png'
import moderate from '../assets/ModReaction.png'

const Output = ({result,capturedImage}) => {
  const [data, setData] = useState(null)

    useEffect(() => {
      fetch('http://192.168.211.1:8000/data')
      .then(response => response.json())
      .then(data => {
        setData(data)
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
    }, [])


    if(data){
      const keyValuePairs = Object.entries(data);

      // Map over the array and render each key-value pair
      var renderedPairs = keyValuePairs.map(([key, value]) => (
      <View key={key}>
        <Text style={{fontSize: 15,margin: 5}}>{key}: {JSON.stringify(value)}</Text>
      </View>
      ));
    }
    
    const components = {
        'healthy': () => (
          <View>
          <View style={styles.container}> 
            <Text style={styles.healthyText}>Healthy Choice</Text>
            <View style={{flexDirection: 'row',width: '100%',marginTop: 10}}>
              <Image source={{uri: capturedImage}} style={styles.img}/>
              <Image source={healthy} style={styles.img}/>
            </View>
            <View>
             <Text>{renderedPairs}</Text>
            </View>
          </View>
            <Text style={[styles.healthyText,{fontSize: 20, textAlign: 'center',marginTop: 100}]}>“Processed food may lack essential nutrients”</Text>
          </View>
        ),
        'unhealthy': () => (
          <View>
          <View style={styles.container}> 
            <Text style={styles.unhealthyText}>Unhealthy Choice</Text>
            <View style={{flexDirection: 'row',width: '100%',marginTop: 10}}>
              <Image source={{uri: capturedImage}} style={styles.img}/>
              <Image source={unhealthy} style={styles.img}/>
            </View>
            <View>
             <Text>{renderedPairs}</Text>
            </View>
          </View>
            <Text style={[styles.unhealthyText,{fontSize: 20, textAlign: 'center',marginTop: 100}]}>“Processed food may lack essential nutrients”</Text>
          </View>
        ),
        'moderate': () => (
          <View>
          <View style={styles.container}> 
            <Text style={styles.moderateText}>Moderate Choice</Text>
            <View style={{flexDirection: 'row',width: '100%',marginTop: 10}}>
              <Image source={{uri: capturedImage}} style={styles.img}/>
              <Image source={moderate} style={styles.img}/>
            </View>
            <View>
            <Text>{renderedPairs}</Text>
            </View>
          </View>
            <Text style={[styles.moderateText,{fontSize: 20, textAlign: 'center',marginTop: 100}]}>Small changes lead to big results!</Text>
          </View>
        ),
      };
  
    const Component = components[result]
    return <Component />;
  
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        height: 500,
        width: 350,
        borderRadius: 20,
        gap: 10,
        top: 30,
        backgroundColor: '#F9FFE5',
        paddingHorizontal: 10, // Add horizontal padding to create space between elements
        paddingVertical: 10,   // Add vertical padding to create space between elements

        // Shadow properties
        shadowColor: "#1C2500",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity:  0.21,
        shadowRadius: 6.65,
        elevation: 10
    },
    img:{
        width: 170,
        height: 200,
        objectFit: 'contain',
    },
    healthyText:{
        color: '#459D00',
        fontSize: 30,
        fontWeight:'600',

    },
    unhealthyText:{
        color: '#FF0000',
        fontSize: 24,
        fontWeight:'600',

    },
    moderateText:{
        color: '#F39123',
        fontSize: 30,
        fontWeight:'600',

    },
})

export default Output