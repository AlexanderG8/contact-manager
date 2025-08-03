// Función que retorna una Promise personalizada
const InitializeApp = (duration = 1000) => {
  return new Promise((resolve) => {
    // setTimeout simula una operación que toma tiempo
    setTimeout(() => {
      // resolve() cumple la promesa con un valor
      resolve(false);
    }, duration); // 3000ms = 3 segundos por defecto
  });
};


export default InitializeApp;