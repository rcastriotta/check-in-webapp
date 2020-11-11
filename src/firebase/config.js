import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig = {
    // FIREBASE PROJECT CONFIG HERE
};

firebase.initializeApp(firebaseConfig);

export const fs = firebase.firestore();
export const auth = firebase.auth();
