import { fireStore } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  setDoc,
  where,
  query,
} from "firebase/firestore";

class FireStore {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async createUser({email, fullName, role}) {
    try {
      const userRef = doc(fireStore, 'users', email);
      await setDoc(userRef, { fullName, role }, { merge: true });
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  }

  // Get a single document by ID
  async getDocument(id) {
    const docRef = doc(fireStore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found");
    }
  }

  // Get all documents in the collection
  async getDocuments() {
    const querySnapshot = await getDocs(
      collection(fireStore, this.collectionName),
    );
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }

  // Add a single document
  async addDocument(data) {
    const docRef = await addDoc(
      collection(fireStore, this.collectionName),
      data,
    );
    return docRef.id;
  }

  // Add multiple documents
  async addDocuments(dataArray) {
    const batch = writeBatch(fireStore);
    dataArray.forEach((data) => {
      const docRef = doc(collection(fireStore, this.collectionName));
      batch.set(docRef, data);
    });
    await batch.commit();
  }

  // Update a single document by ID
  async updateDocument(id, data) {
    const docRef = doc(fireStore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  // Update multiple documents
  async updateDocuments(updates) {
    const batch = writeBatch(fireStore);
    updates.forEach(({ id, data }) => {
      const docRef = doc(fireStore, this.collectionName, id);
      batch.update(docRef, data);
    });
    await batch.commit();
  }

  // Delete a single document by ID
  async deleteDocument(id) {
    const docRef = doc(fireStore, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Delete multiple documents by ID
  async deleteDocuments(ids) {
    const batch = writeBatch(fireStore);
    ids.forEach((id) => {
      const docRef = doc(fireStore, this.collectionName, id);
      batch.delete(docRef);
    });
    await batch.commit();
  }

  async conditionalGet(
    conditions,
  ) {
    try {
      const colRef = collection(fireStore, this.collectionName);

      const queryConstraints = conditions.map((condition) =>
        where(condition.field, condition.operator, condition.value),
      );

      const q = query(colRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({...doc.data(), id:doc.id});
        });
        return results;
      } else {
        console.log("No matching documents!");
        return null;
      }
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  }
}

export default FireStore;
