import { initializeApp, cert } from 'firebase-admin/app';

const app = initializeApp({
  credential: cert('src/config/serviceAccount.json')
});

export default app;
