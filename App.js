import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiStatus, setBmiStatus] = useState('');
  const [healthAdvice, setHealthAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const calculateBMI = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert cm to m
    if (weightNum > 0 && heightNum > 0) {
      const bmiValue = (weightNum / (heightNum * heightNum)).toFixed(2);
      setBmi(bmiValue);
      let status;
      if (bmiValue < 18.5) {
        status = 'Kekurangan Berat Badan';
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        status = 'Normal';
      } else if (bmiValue >= 25 && bmiValue < 30) {
        status = 'Kelebihan Berat Badan';
      } else {
        status = 'Obesitas';
      }
      setBmiStatus(status);

      setIsLoading(true);
      try {
        const response = await fetch('https://world.openfoodfacts.org/api/v0/product/737628064502.json');
        const data = await response.json();
        
        if (data && data.product) {
          const product = data.product;
          setHealthAdvice({
            productName: product.product_name,
            calories: product.nutriments['energy-kcal_100g'],
            protein: product.nutriments.proteins_100g,
            fat: product.nutriments.fat_100g,
            carbs: product.nutriments.carbohydrates_100g
          });
        } else {
          setHealthAdvice(null);
        }
      } catch (error) {
        console.error('Error fetching nutritional info:', error);
        setHealthAdvice(null);
      }
      setIsLoading(false);

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Kalkulator BMI</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setWeight}
              value={weight}
              placeholder="Berat (kg)"
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={setHeight}
              value={height}
              placeholder="Tinggi (cm)"
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={calculateBMI}>
            <Text style={styles.buttonText}>Hitung BMI</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#ffffff" />}
          {bmi !== '' && !isLoading && (
            <Animated.View style={[styles.resultContainer, { transform: [{ scale: resultScale }] }]}>
              <Text style={styles.resultText}>BMI Anda: {bmi}</Text>
              <Text style={styles.resultText}>Status: {bmiStatus}</Text>
              <View style={styles.adviceContainer}>
                <Text style={styles.adviceTitle}>Saran Nutrisi:</Text>
                {healthAdvice ? (
                  <>
                    <Text style={styles.adviceText}>Berdasarkan BMI Anda ({bmiStatus}), perhatikan asupan nutrisi Anda. Berikut contoh informasi nutrisi dari produk "{healthAdvice.productName}":</Text>
                    <View style={styles.nutritionInfo}>
                      <Text style={styles.nutritionItem}>• Kalori: {healthAdvice.calories} kcal per 100g</Text>
                      <Text style={styles.nutritionItem}>• Protein: {healthAdvice.protein}g per 100g</Text>
                      <Text style={styles.nutritionItem}>• Lemak: {healthAdvice.fat}g per 100g</Text>
                      <Text style={styles.nutritionItem}>• Karbohidrat: {healthAdvice.carbs}g per 100g</Text>
                    </View>
                    <Text style={styles.adviceText}>Ingat untuk selalu menjaga pola makan seimbang dan berkonsultasi dengan ahli gizi untuk saran yang lebih personal.</Text>
                  </>
                ) : (
                  <Text style={styles.adviceText}>Tidak dapat mengambil informasi nutrisi saat ini. Silakan konsultasikan dengan ahli gizi untuk saran yang lebih personal.</Text>
                )}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
    alignItems: 'stretch',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  adviceContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  adviceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  nutritionInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  nutritionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});