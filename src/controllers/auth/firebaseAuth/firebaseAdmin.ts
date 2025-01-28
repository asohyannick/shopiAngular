import admin from 'firebase-admin';
interface ServiceAccount {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId:string;
    authUri: string;
    tokenUri:string;
    authProviderX509CertUrl:string;
    clientX509CertUrl:string;
    universe_domain:string;
}
// Create a service account object from environment
const serviceAccount: ServiceAccount = {
 type: process.env.FIREBASE_TYPE as string,
 projectId: process.env.FIREBASE_PROJECT_ID as string,
 privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID as string,
 clientEmail: process.env.CLIENT_EMAIL as string,
 privateKey:(process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '') as string, // Format the private key,
 clientId: process.env.CLIENT_ID as string,
 authUri: process.env.AUTH_URL as string,
 tokenUri: process.env.TOKEN_URL as string,
 authProviderX509CertUrl: process.env.AUTH_PROVIDER_URL as string,
clientX509CertUrl: process.env.CLIENT_URL as string,
 universe_domain: process.env.UNIVERSE_DOMAIN as string
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
