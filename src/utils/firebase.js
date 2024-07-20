import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkSAEznD5f-jC0i_v9DXXA8Jnyw7jtVKw",
  authDomain: "apls-ce9eb.firebaseapp.com",
  projectId: "apls-ce9eb",
  storageBucket: "apls-ce9eb.appspot.com",
  messagingSenderId: "219761636584",
  appId: "1:219761636584:web:a8bdb56e5a0104edc3055d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore(app);