import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Modular entry points: firebase-admin 14 no longer exposes the namespaced
// `app.firestore()` / `app.auth()` accessors on the App type.
export const app = initializeApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
