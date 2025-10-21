import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchProducts } from '../modules/products/redux/productsSlice';

interface SplashScreenProps {
  onReady: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onReady }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const initializeApp = async () => {
      try {
        await dispatch(fetchProducts()).unwrap();

        timer = setTimeout(onReady, 1500);
      } catch {
        timer = setTimeout(onReady, 1000);
      }
    };

    initializeApp();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [dispatch, onReady]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>StoreApp</Text>
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 32,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});