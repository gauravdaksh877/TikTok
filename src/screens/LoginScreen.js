import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Firebase web client ID
});

export default function LoginScreen() {
  const signInWithGoogle = async () => {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get users ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create Google credential with token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign in the user with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Save user data to Firestore
      const { user } = userCredential;
      await firestore().collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Error', 'Failed to sign in with Google');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>VideoFeed</Text>
        <Text style={styles.subtitle}>Join the community</Text>
        
        <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
          <Icon name="login" size={24} color="#fff" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF0050',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 60,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0050',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});