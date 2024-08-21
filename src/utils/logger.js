import { formatDate } from './dateUtils.js'; // Ajusta la ruta según tu estructura

export function logNoti(message, data = {}) {
    const formattedMessage = `${formatDate()} - Notification: ${message || 'No message provided'}`;
    
    // Imprime una línea en blanco para separar los mensajes
    console.log(formattedMessage);
        if (Object.keys(data).length > 0) {
      console.log('Data:', JSON.stringify(data, null, 2));
    }
    
  }
  

export function logInfo(message, data = {}) {
  const formattedMessage = `${formatDate()} - INFO: ${message || 'No message provided'}`;
  
  // Imprime una línea en blanco para separar los mensajes
  console.log();
  console.log(formattedMessage);
  
  // Solo imprime el objeto data si no está vacío
  if (Object.keys(data).length > 0) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  
  // Imprime otra línea en blanco para separación
  console.log();
}

export function logError(message, errorDetails = {}) {
  const formattedMessage = `${formatDate()} - ERROR: ${message || 'No message provided'}`;
  
  // Imprime una línea en blanco para separar los mensajes
  console.log();
  console.error(formattedMessage);
  
  // Solo imprime el objeto errorDetails si no está vacío
  if (Object.keys(errorDetails).length > 0) {
    console.error('Error Details:', JSON.stringify(errorDetails, null, 2));
  }
  
  // Imprime otra línea en blanco para separación
  console.log();
}
