import { db, auth } from "./firebaseSetup";
import { collection, doc, getDoc, setDoc, query, where, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import uuid from "react-native-uuid";

const storage = getStorage();

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

export const fetchHealthRecords = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const recordsCollection = collection(db, "healthRecords");
    const userQuery = query(recordsCollection, where("uid", "==", user.uid));
    const recordsSnapshot = await getDocs(userQuery);
    return recordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching health records: ", error);
    throw error;
  }
};

export const addOrUpdateHealthRecord = async (record) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (record.id) {
      const recordRef = doc(db, "healthRecords", record.id);
      await updateDoc(recordRef, { ...record, uid: user.uid });
    } else {

      await addDoc(collection(db, "healthRecords"), { ...record, uid: user.uid });
    }
  } catch (error) {
    console.error("Error adding/updating record: ", error);
    throw error;
  }
};

export const deleteHealthRecord = async (id) => {
  try {
    const recordRef = doc(db, "healthRecords", id);
    await deleteDoc(recordRef);
  } catch (error) {
    console.error("Error deleting record: ", error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userProfileRef = doc(db, "users", user.uid);
    const userProfileSnapshot = await getDoc(userProfileRef);
    if (userProfileSnapshot.exists()) {
      const data = userProfileSnapshot.data();
      return { ...data, age: data.age ?? "" };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userProfileRef = doc(db, "users", user.uid);
    await setDoc(userProfileRef, profile, { merge: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const fetchMedicineReminders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const remindersCollection = collection(db, "medicine");
    const userQuery = query(remindersCollection, where("uid", "==", user.uid));
    const remindersSnapshot = await getDocs(userQuery);
    return remindersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching medicine reminders:", error);
    throw error;
  }
};

export const addOrUpdateMedicineReminder = async (reminder) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (reminder.id) {
      const reminderRef = doc(db, "medicine", reminder.id);
      await updateDoc(reminderRef, { ...reminder, uid: user.uid });
    } else {

      const docRef = await addDoc(collection(db, "medicine"), { ...reminder, uid: user.uid });
      reminder.id = docRef.id; 
      await updateDoc(docRef, { id: docRef.id });
    }
  } catch (error) {
    console.error("Error adding/updating reminder: ", error);
    throw error;
  }
};

export const deleteMedicineReminder = async (id) => {
  try {
    const reminderRef = doc(db, "medicine", id);
    await deleteDoc(reminderRef);
  } catch (error) {
    console.error("Error deleting medicine reminder: ", error);
    throw error;
  }
};

export const addOrUpdateRecoveryRecord = async (record) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (record.id) {
      const recordRef = doc(db, "recoveryRecords", record.id);
      await updateDoc(recordRef, { ...record, uid: user.uid });
    } else {
      const docRef = await addDoc(collection(db, "recoveryRecords"), { ...record, uid: user.uid });
      record.id = docRef.id;
      await updateDoc(docRef, { id: docRef.id });
    }
  } catch (error) {
    console.error("Error adding/updating record:", error);
    throw error;
  }
};

export const fetchRecoveryRecords = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const recordsCollection = collection(db, "recoveryRecords");
    const userQuery = query(recordsCollection, where("uid", "==", user.uid));
    const recordsSnapshot = await getDocs(userQuery);
    return recordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const deleteRecoveryRecord = async (id) => {
  try {
    const recordRef = doc(db, "recoveryRecords", id);
    await deleteDoc(recordRef);
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export const fetchRecoveryRecordById = async (id) => {
  try {
    const recordRef = doc(db, "recoveryRecords", id);
    const recordSnapshot = await getDoc(recordRef);
    if (recordSnapshot.exists()) {
      return { id: recordSnapshot.id, ...recordSnapshot.data() };
    } else {
      throw new Error("Record not found");
    }
  } catch (error) {
    console.error("Error fetching recovery record:", error);
    throw error;
  }
};

export const uploadImageToStorage = async (imageUri) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = `images/${user.uid}/${uuid.v4()}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    return { downloadURL, storagePath: fileName };
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw error;
  }
};

export const deleteImageFromStorage = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image from storage:", error);
    throw error;
  }
};