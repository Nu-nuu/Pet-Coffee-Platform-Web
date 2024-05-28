import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBUf2-kDpPGY5HH7-GLgfqUEoTYPTMNaaU",
    authDomain: "petcoffeeshop-888c1.firebaseapp.com",
    projectId: "petcoffeeshop-888c1",
    storageBucket: "petcoffeeshop-888c1.appspot.com",
    messagingSenderId: "458181458037",
    appId: "1:458181458037:web:d62f1c7a2297d75d13a03c",
    measurementId: "G-YK4WP5V81R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);