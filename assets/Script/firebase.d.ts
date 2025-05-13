// assets/firebase.d.ts
import { 
    Firestore, 
    CollectionReference,
    DocumentData,
    DocumentReference,
    Query,
    QuerySnapshot,
    DocumentSnapshot
  } from "firebase/firestore";
  import {FirebaseApp} from 'firebase/app'
  import {Auth} from 'firebase/auth'
  declare global {
    interface Window {
      firebase: {
        // Core Firebase
        app: FirebaseApp;
        db: Firestore;
        auth: Auth;
        
        // Auth Methods
        signInAnonymously: () => Promise<void>;
        
        // Firestore Methods (add what you use)
        collection;
        addDoc;
        getDocs;
        doc;
        getDoc;
        onSnapshot;
        
        // Add other Firebase methods as needed
      };
    }
  }