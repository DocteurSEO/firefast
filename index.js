import firebaseConfig from 'config.js';
import * as firebase from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js";
import { auth } from  "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js";
import { db } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js";



  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


  async function save(collection, document, docId = null) {
    let docRef;
    if (docId) {
      docRef = db.collection(collection).doc(docId);
    } else {
      docRef = db.collection(collection).doc();
    }
  
    await docRef.set(document);
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
    const result = await auth.signInAnonymously();
    const uid = result.user.uid;
    localStorage.setItem('uid', uid);
    return uid;
  }

  async function authenticateAnonymously() {
    const result = await auth.signInAnonymously();
    const uid = result.user.uid;
    localStorage.setItem('uid', uid);
    return uid;
  }


  async function getDoc(collectionName, docId) {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data();
    } else {
      throw new Error('No such document!');
    }
  }

  async function updateDoc(collectionName, docId, updateData) {
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.update(updateData);
  }