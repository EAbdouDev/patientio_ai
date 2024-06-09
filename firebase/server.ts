import serviceAccount from "@firebase/serviceAccount.json";
import { initializeApp } from "firebase-admin";
import { ServiceAccount, cert, getApps } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Auth, getAuth } from "firebase-admin/auth";

let firestore: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;
const currentApps = getApps();

let serviceAccountVar;

try {
  if (currentApps.length === 0) {
    if (process.env.NEXT_PUBLIC_APP_ENV === "emulator") {
      process.env["FIRESTORE_EMULATOR_HOST"] =
        process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH!;
      process.env["FIRESTORE_AUTH_EMULATOR_HOST"] =
        process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH!;

      serviceAccountVar = serviceAccount;
    } else {
      serviceAccountVar = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT as string
      ) as ServiceAccount;
    }

    const app = initializeApp({
      credential: cert(serviceAccountVar as ServiceAccount),
    });

    firestore = getFirestore(app);
    auth = getAuth(app);
  } else {
    firestore = getFirestore(currentApps[0]);
    auth = getAuth(currentApps[0]);
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

export { firestore, auth };
