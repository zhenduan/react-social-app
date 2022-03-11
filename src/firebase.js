import firebase from "firebase";
// import "firebase/auth";
// import "firebase/storage";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp({
  //config info
  apiKey: "AIzaSyBeY7msqeDJC5N26H_tQ0qX3Zg3N1awZdg",
  authDomain: "react-instagram-app-74910.firebaseapp.com",
  projectId: "react-instagram-app-74910",
  storageBucket: "react-instagram-app-74910.appspot.com",
  messagingSenderId: "473244614798",
  appId: "1:473244614798:web:f484c34ee48fcf8a5d49df",
  measurementId: "G-0HDFR87KNL",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();
// sign in with google
const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// sign in with password and email
const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// register with email and password
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// reset password
const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// sign out
const logout = () => {
  auth.signOut();
};

export {
  db,
  auth,
  storage,
  signInWithGoogle,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};
// export default db;
