import {
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from "./config";
import FireStore from './firestore';

class Authentication {
  
    // Register a new user with email and password
    async register({email,password, fullName}) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await new FireStore("users").createUser({email, fullName});
        return userCredential.user;
      } catch (error) {
        alert("An error occured!");
        console.error("Error registering new user:", error);
        return null;
      }
    }
  
    // Sign in a user with email and password
    async signIn(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        let response = await new FireStore("users").getDocument(email);
        sessionStorage.setItem("user", JSON.stringify(response));
        return userCredential.user;
      } catch (error) {
        console.error("Error signing in:", error);
        return null;
      }
    }
  
    // Sign out the current user
    async signOut() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  
    // Send password reset email
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error("Error sending password reset email:", error);
      }
    }
  
    // Observe user state changes
    onAuthStateChanged() {
      onAuthStateChanged(auth, async () => {
        let response = await new FireStore("users").getDocument(auth.currentUser.email);
        sessionStorage.setItem("user", JSON.stringify(response));
      });
    }
  
    // Get the current authenticated user
    getCurrentUser() {
      return auth.currentUser;
    }
  }
  
  export default Authentication;