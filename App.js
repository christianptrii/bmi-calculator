import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiStatus, setBmiStatus] = useState('');
  const [animation] = useState(new Animated.Value(0));

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert cm to m
    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = (weightNum / (heightNum * heightNum)).toFixed(2);
      setBmi(bmiValue);
      if (bmiValue < 18.5) {
        setBmiStatus('Underweight');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiStatus('Normal');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiStatus('Overweight');
      } else {
        setBmiStatus('Obese');
      }

      Animated.spring(animation, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  const resultScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <Text style={styles.title}>BMI Calculator</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setWeight}
          value={weight}
          placeholder="Weight (kg)"
          placeholderTextColor="#a0a0a0"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={setHeight}
          value={height}
          placeholder="Height (cm)"
          placeholderTextColor="#a0a0a0"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      {bmi !== '' && (
        <Animated.View style={[styles.resultContainer, { transform: [{ scale: resultScale }] }]}>
          <Text style={styles.resultText}>Your BMI: {bmi}</Text>
          <Text style={styles.resultText}>Status: {bmiStatus}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 25,
    width: width * 0.7,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
});