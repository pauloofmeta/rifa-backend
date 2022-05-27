// import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import app from '../config/firebase-config';

// const db = getDatabase(app);
const firestore = getFirestore(app);

export default firestore;