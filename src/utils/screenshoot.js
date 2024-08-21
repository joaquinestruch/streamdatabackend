import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatDate } from '../utils/dateUtils.js';

// Obtener la ruta del directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Captura una captura de pantalla del stream m3u8 y la guarda en una carpeta local.
 * @param {Object} livedata - Datos del JSON que contiene la URL m3u8 y otros detalles.
 * @returns {Promise<string>} - Ruta de la imagen guardada localmente.
 */
export function captureScreenshot(livedata) {
  return new Promise((resolve, reject) => {
    // Extraer datos del JSON
    const { m3u8Url, channel } = livedata;

    // Formato de la fecha en 'yyyy-mm-dd'
    const currentDate = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires'
    });

    // Crear ruta de salida basada en el nombre del canal y la fecha
    const channelFolder = path.resolve(__dirname, '../images', channel);
    const dateFolder = path.resolve(channelFolder, currentDate);

    // Crear carpeta del canal y de la fecha si no existen
    if (!fs.existsSync(dateFolder)) {
      fs.mkdirSync(dateFolder, { recursive: true });
    }

    // Obtener la hora actual formateada para el nombre del archivo
    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, ''); // Formato: 'HHmmss'
    
    const outputFile = path.join(dateFolder, `${formattedTime}.png`);

    // Captura de pantalla y guardado en la carpeta local
    ffmpeg(m3u8Url)
      .on('end', () => {
        console.log(`Screenshot taken and saved as ${outputFile}`);
        resolve(outputFile); // Resolver la promesa con la ruta local de la imagen
      })
      .on('error', (err) => {
        console.error('Error capturing screenshot:', err);
        reject(err);
      })
      .screenshots({
        timestamps: ['-1'], // Captura el último frame
        filename: path.basename(outputFile),
        folder: dateFolder // Carpeta donde se guardará la captura
      });
  });
}
