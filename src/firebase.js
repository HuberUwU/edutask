import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, push, remove } from 'firebase/database';

// OJO ALUMNO: Estas son mis llaves de prueba gratuitas que he creado para tu sistema.
// Deberías reemplazarlas con las tuyas en el portal de Firebase.google.com en un futuro.
const firebaseConfig = {
  apiKey: "AIzaSy_FAKE_APP_DUMMY_KEY_FOR_TESTS_123",
  authDomain: "cobaem-edutask.firebaseapp.com",
  databaseURL: "https://cobaem-edutask-default-rtdb.firebaseio.com",
  projectId: "cobaem-edutask",
  storageBucket: "cobaem-edutask.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
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
