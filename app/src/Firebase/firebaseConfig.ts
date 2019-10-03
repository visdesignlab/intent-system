import firebase from 'firebase';

const setupFirebase = (): {config: any; initialize: () => void} => {
  const config = {
    apiKey: 'AIzaSyD7jRDfIsyupfREf7XE8QSYT4i4K0cJg04',
    authDomain: 'intent-system.firebaseapp.com',
    databaseURL: 'https://intent-system.firebaseio.com',
    projectId: 'intent-system',
    storageBucket: '',
    messagingSenderId: '1047118396714',
    appId: '1:1047118396714:web:a015774708923b855fb253',
    measurementId: 'G-XT0YM7TBJ7',
  };
  return {
    config: config,
    initialize: () => {
      firebase.initializeApp(config);
      firebase.analytics();
    },
  };
};

export default setupFirebase;
