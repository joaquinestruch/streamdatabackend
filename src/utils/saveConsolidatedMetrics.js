// file: dataAccumulator.js
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const tempFilePath = path.resolve( '../data', 'temp_data.json');

/**
 * Acumula los datos en un archivo temporal.
 * @param {Object} livedata - Objeto de métricas del canal.
 */
export async function accumulateMetrics(livedata) {
  try {
    // Crear el directorio si no existe
    const dir = path.dirname(tempFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Leer datos acumulados existentes
    let existingData = [];
    if (fs.existsSync(tempFilePath)) {
      const existingDataContent = fs.readFileSync(tempFilePath, 'utf8');
      existingData = JSON.parse(existingDataContent);
    }

    // Agregar nuevos datos
    existingData.push(livedata);

    // Guardar los datos acumulados en el archivo temporal
    fs.writeFileSync(tempFilePath, JSON.stringify(existingData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error accumulating metrics:', error);
  }
}

/**
 * Guarda los datos acumulados en un archivo JSON consolidado y limpia el archivo temporal.
 */
export async function saveConsolidatedMetrics() {
  const tempFilePath = path.resolve(__dirname, '../data', 'temp_data.json');
  const consolidatedFilePath = getConsolidatedFilePath();

  try {
    // Leer datos acumulados
    let accumulatedData = [];
    if (fs.existsSync(tempFilePath)) {
      const accumulatedDataContent = fs.readFileSync(tempFilePath, 'utf8');
      accumulatedData = JSON.parse(accumulatedDataContent);
    }

    // Crear el directorio si no existe
    const dir = path.dirname(consolidatedFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Guardar los datos acumulados en el archivo consolidado
    fs.writeFileSync(consolidatedFilePath, JSON.stringify({ timestamp: moment().format(), channels: accumulatedData }, null, 2), 'utf8');

    // Limpiar el archivo temporal
    fs.unlinkSync(tempFilePath);

    console.log('Consolidated metrics saved successfully.');
  } catch (error) {
    console.error('Error saving consolidated metrics:', error);
  }
}

/**
 * Genera la ruta del archivo JSON consolidado.
 * @returns {string} - Ruta completa del archivo JSON consolidado.
 */
function getConsolidatedFilePath() {
  const currentDate = moment().format('YYYY-MM-DD');
  return path.resolve(__dirname, '../data', `consolidated_${currentDate}.json`);
}
