import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import { captureScreenshot } from './screenshoot.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

function getDailyFilePath(channelName) {
  const currentDate = moment().format('YYYY-MM-DD');
  return path.resolve('./src/data', channelName, `${currentDate}.json`);
}

export async function logData(livedata) {
  const { channel, viewers, title, thumbnail } = livedata;
  const currentTime = moment().tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DDTHH:mm:ss');

  try {
    const dataFilePath = getDailyFilePath(channel);
    const folderPath = path.dirname(dataFilePath);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    let allData = [];
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      allData = JSON.parse(fileData);
    }

    // Filtrar datos para el canal y fecha actuales
    let channelData = allData.filter(d => d.channel === channel && d.timestamp.startsWith(moment().format('YYYY-MM-DD')));


    // Obtener el último valor de viewers registrado para el canal y fecha
    let lastViewers = 0;
    if (allData.length > 0) {
      const lastMeasurement = allData[allData.length - 1];
      lastViewers = lastMeasurement.viewers || 0;
    }

    const lastFrame = await captureScreenshot(livedata);
    const spread = viewers - lastViewers; // Calcula el spread como la diferencia entre el valor actual y el último registrado

    console.log(`Last viewers: ${lastViewers}`);
    console.log(`Current viewers: ${viewers}`);
    console.log(`Spread: ${spread}`);


    const documentData = {
      timestamp: currentTime,
      viewers: viewers || "",
      title: title || "",
      thumbnail: thumbnail || '',
      frame: lastFrame || '',
      spread: spread == viewers ? 0 : spread// El spread es la diferencia entre el nuevo y el último valor registrado
    };

    // Agregar los nuevos datos
    channelData.push(documentData);

    // Actualizar allData eliminando los datos antiguos y añadiendo los nuevos
    allData = allData.filter(d => !(d.channel === channel && d.timestamp.startsWith(moment().format('YYYY-MM-DD'))));
    allData.push(...channelData);

    // Guardar todos los datos en el archivo JSON del día
    fs.writeFileSync(dataFilePath, JSON.stringify(allData, null, 2), 'utf8');
    console.log('Data saved successfully to local file.');

  } catch (error) {
    console.error(`Error saving data locally:`, error);
  }
}
