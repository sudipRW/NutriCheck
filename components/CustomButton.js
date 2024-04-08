import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const CustomButton = ({ onPress, title, style,src }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {
        src &&(
          <Image source={src} style={{width: 40,height:40,}}/>
        )
      }
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#459D00',
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 25,
    justifyContent: 'center'
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomButton;
