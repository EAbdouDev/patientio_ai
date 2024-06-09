"use client";

import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD74AWm7TOeQpJEqen2RBA-CY4zc8BKRCc",
  authDomain: "patientio-ai.firebaseapp.com",
  projectId: "patientio-ai",
  storageBucket: "patientio-ai.appspot.com",
  messagingSenderId: "45840149848",
  appId: "1:45840149848:web:6080b5c4d09ca35c8f892d",
  measurementId: "G-MG4M2Z448W",
};

const currentApps = getApps();

let auth: Auth | undefined = undefined;

if (currentApps.length <= 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
  }
} else {
  auth = getAuth(currentApps[0]);
  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(
      auth,
      `https://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
    );
  }
}

export { auth };
