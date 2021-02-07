import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/auth';

import userEvent from '@testing-library/user-event';

const firebaseConfig = {
  apiKey           : "AIzaSyDBlofmMUEoKfSOlJLCMqOTC6V9wO5Uxns",
  authDomain       : "colemanbowl-bets.firebaseapp.com",
  projectId        : "colemanbowl-bets",
  storageBucket    : "colemanbowl-bets.appspot.com",
  messagingSenderId: "878086137452",
  appId            : "1:878086137452:web:16e0b62f4774a4bfd8da49",
  measurementId    : "G-MGZRVCN0RJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()

export const signInWithGoogle = () => {
  firebase.auth().signInWithPopup(googleProvider).then((res) => {
    console.log(res.user)
  }).catch((error) => {
    console.log(error.message)
  })
}


export const db = firebase.database();

const fb = firebase
export default fb;
