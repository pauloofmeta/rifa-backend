import { getFirestore } from 'firebase-admin/firestore';
import app from '../config/firebase-config'
import seedNumbers from "./SeedNumbers";

var firestore = getFirestore(app);
seedNumbers(firestore);