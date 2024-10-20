import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig={
    apiKey: "AIzaSyDBJtzHUpSdVe8z7IRGA8Rb_90J_hSO26U",
    authDomain: "transactify-49691.firebaseapp.com",
    projectId: "transactify-49691",
    storageBucket: "transactify-49691.appspot.com",
    messagingSenderId: "1044317317083",
    appId: "1:1044317317083:web:8d4b688362988f953be9fe",
    measurementId: "G-CB8NXDLP3F"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);