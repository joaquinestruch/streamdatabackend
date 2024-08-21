import { channels } from './config/channel.js';
import { startMonitoring } from './monitor.js';

// Iniciar el monitoreo con la lista de canales
startMonitoring(channels);
