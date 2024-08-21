import { FlowMonitor } from 'flow-monitor';
import { logInfo, logError, logNoti } from './utils/logger.js';
import { logData } from './utils/logData.js';

// Instanciar la clase FlowMonitor
const fMonitor = new FlowMonitor({
  youtube: {
    headers: {}, // Opcional: Encabezados HTTP para la API de YouTube
    intervalChecker: 60 * 1000, // Tiempo en milisegundos (10 segundos)
  },
});

export function startMonitoring(channels) {
  // Conectar a los canales en YouTube
  channels.forEach(channel => {
    logNoti(`Connecting to channel: ${channel}`);
    fMonitor.connect(channel, 'youtube');
  });

  // Iniciar el monitoreo
  logNoti('Starting FlowMonitor.');
  fMonitor.start();

  // Manejar eventos
  fMonitor.on('start', () => {
    logInfo('Flow monitor started');
  });

  fMonitor.on('newChannel', ({ name, platform }) => {
    logInfo(`New channel connected: ${name} (${platform})`);
  });

  fMonitor.on('disconnectChannel', ({ name, platform }) => {
    logInfo(`Channel disconnected: ${name} (${platform})`);
  });

  fMonitor.on('close', () => {
    logInfo('Flow monitor has been closed');
  });

  fMonitor.on('streamDown', (livedata) => {
    logInfo(`Stream is down: ${JSON.stringify(livedata)}`);

    // Verificar si la transmisión sigue activa o si la información es reciente
    if (livedata.viewers > 0) {
      logInfo('The stream appears to be still active or the data might be outdated.');
    } else {
      logInfo('The stream is confirmed to be down.');
      // Aquí puedes agregar más lógica para manejar cuando un stream está realmente fuera de línea
    }
  });

  fMonitor.on('category', (livedata) => {
    logInfo(`Category changed: ${JSON.stringify(livedata)}`);
  });

  fMonitor.on('title', (livedata) => {
    logInfo(`Title changed: ${JSON.stringify(livedata)}`);
  });

  fMonitor.on('viewerCount', (livedata) => {
    logInfo(`Viewer count changed: ${JSON.stringify(livedata)}`);
    // Captura de pantalla y registro de visitas

    logData(livedata);
  

  });

  // Manejo de errores en el monitoreo
  fMonitor.on('error', (err) => {
    logError(`Error in FlowMonitor: ${err.message}`);
  });

  // Cerrar el monitor al finalizar (si es necesario)
  // fMonitor.close();
}
