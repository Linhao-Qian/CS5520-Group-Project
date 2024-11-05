import { db, auth } from "./firebaseSetup";
import { doc, setDoc } from "firebase/firestore";

export const createUserProfile = async (profile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userProfileRef = doc(db, "users", user.uid);
    await setDoc(userProfileRef, profile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};
