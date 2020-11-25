import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { github } from '../constants/constants';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const db = firebase.firestore();

const socialNetworkProvider = (socialNetwork) => {
  switch (socialNetwork) {
    case github:
      return new firebase.auth.GithubAuthProvider();
    default:
      return new firebase.auth.GoogleAuthProvider();
  }
};

export { db, firebase, socialNetworkProvider };
