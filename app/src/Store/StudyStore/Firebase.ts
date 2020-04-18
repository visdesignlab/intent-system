import 'firebase/database';
import 'firebase/firestore';

import firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyA5uubr3-bnPNn_hEpvH_OhAIk9HJ_T53U",
  authDomain: "intent-system-prolific.firebaseapp.com",
  databaseURL: "https://intent-system-prolific.firebaseio.com",
  projectId: "intent-system-prolific",
  storageBucket: "intent-system-prolific.appspot.com",
  messagingSenderId: "393407031419",
  appId: "1:393407031419:web:bd3c2216c601d011ee1ade",
  measurementId: "G-RQ8LS8DWT9",
};

export function initializeFirebase() {
  const app: firebase.app.App =
    firebase.apps.length === 0
      ? firebase.initializeApp(config)
      : firebase.app();

  const firestore = firebase.firestore(app);
  const rtd = firebase.database(app);
  const graphRTD = app.database(
    "https://task-provenance-database.firebaseio.com/"
  );

  return {
    config,
    app,
    firestore,
    rtd,
    graphRTD,
  };
}
