// app/firebase/clientApp.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMiu_koiNebQqxBx-ASD0zi76anXTAjV4",
  authDomain: "gokids-4df3b.firebaseapp.com",
  projectId: "gokids-4df3b",
  storageBucket: "gokids-4df3b.appspot.com",
  messagingSenderId: "320532054759",
  appId: "1:320532054759:web:2041377192185ec3ed5842",
  measurementId: "G-ZQP59TJ5BL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);