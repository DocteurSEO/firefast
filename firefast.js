import firebaseConfig from './config.js';
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { updateDoc,  getFirestore, doc, getDoc, collection, setDoc, addDoc  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

 


  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)

  async function save(collectionName, data, docId = null) {
    let docRef;
    if (docId) {
        docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data);
    } else {
        docRef = await addDoc(collection(db, collectionName), data);
    }

    return docRef.id;
  }



  function getRealTimeCollection(collectionName, callback) {
    const collectionRef = db.collection(collectionName);
    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      let collectionData = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id; // Ajouter l'ID du document aux données
        collectionData.push(data);
      });
      callback(collectionData);
    });
  
    // Retourner la fonction pour se désabonner des mises à jour
    return unsubscribe;
  }



  async function authenticateAnonymously() {
    const auth = getAuth();
    const user = await signInAnonymously(auth);
    console.log(user);
    const uid = user.user.uid;
    return uid;
  }


  async function getDataDoc(collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('No such document!');
    }
  }

  async function updateD(collectionName, docId, updateData) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateData);
  }



  async function createUser(email, password) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem('uid', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function signIn(email, password) {
  const auth = getAuth();
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('uid', userCredential.user.uid);
      return userCredential.user;
  } catch (error) {
      if (error.code === 'auth/user-not-found') {
          return createUser(email, password);
      }
      console.error(error);
      throw error;
  }
}


export {save, , getDataDoc, createUser, signIn}
