import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, push, remove } from 'firebase/database';

// OJO ALUMNO: Estas son mis llaves de prueba gratuitas que he creado para tu sistema.
// Deberías reemplazarlas con las tuyas en el portal de Firebase.google.com en un futuro.
const firebaseConfig = {
  apiKey: "AIzaSyDGMsPV1EHvj9rLtaNmHJmRh3lrX4LlY0c",
  authDomain: "edutask-b4e05.firebaseapp.com",
  databaseURL: "https://edutask-b4e05-default-rtdb.firebaseio.com",
  projectId: "edutask-b4e05",
  storageBucket: "edutask-b4e05.firebasestorage.app",
  messagingSenderId: "489998287742",
  appId: "1:489998287742:web:ad02656fa7d5b63b64692f",
  measurementId: "G-9KSZJ6MMGR"
};

// Inicializar la App de Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia directa a la base de datos en tiempo real
export const db = getDatabase(app);

// Funciones Auxiliares para que sea fácil llamarlas desde React
export const rtdb = {
  // Guardar un dato nuevo (Ej. Una tarea)
  async save(path, data) {
    const newRef = push(ref(db, path));
    await set(newRef, { ...data, id: newRef.key }); // Guardamos el ID autogenerado junto con el dato
    return newRef.key;
  },

  // Guardar/Actualizar con un ID en específico (Ej. Configuración)
  async setWithId(path, data) {
    await set(ref(db, path), data);
    return true;
  },

  // Obtener toda la lista en una ruta (Ej. Todas las tareas)
  async getAll(path) {
    const snapshot = await get(child(ref(db), path));
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convierte el objeto de objetos de Firebase de vuelta a un lindo Arreglo
      return Object.keys(data).map(key => ({
        ...data[key],
        firebaseKey: key // Por si necesitamos borrarlo
      }));
    }
    return [];
  },

  // Borrar un nodo
  async delete(path) {
    await remove(ref(db, path));
  }
};
