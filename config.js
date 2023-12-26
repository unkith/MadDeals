// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDtGTH3HGAQel156bGwQR7OJTMVjjAzwg8",
  authDomain: "maddeals-536ee.firebaseapp.com",
  projectId: "maddeals-536ee",
  storageBucket: "maddeals-536ee.appspot.com",
  messagingSenderId: "896566742530",
  appId: "1:896566742530:web:86f59807f01111b9e2611b",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export { firebase }
