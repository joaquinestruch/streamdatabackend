import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Inicializa Express
const app = express();
const port = process.env.PORT || 3001;

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener la ruta absoluta al directorio de datos
const dataDir = path.resolve(__dirname, '../src/data');

// Ruta para obtener la lista de archivos JSON de un canal específico
app.get('/channel/:channelName', (req, res) => {
  const { channelName } = req.params;
  const channelPath = path.resolve(dataDir, channelName);

  // Verifica si el directorio del canal existe
  if (!fs.existsSync(channelPath)) {
    res.status(404).send({ error: 'Channel not found' });
    return;
  }

  // Leer los archivos JSON en el directorio del canal
  fs.readdir(channelPath, (err, files) => {
    if (err) {
      res.status(500).send({ error: 'Unable to read directory' });
      return;
    }

    // Filtrar los archivos JSON
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonFiles);
  });
});

// Ruta para obtener el JSON más reciente de un canal específico
app.get('/channel/:channelName/latest', (req, res) => {
  const { channelName } = req.params;
  const channelPath = path.resolve(dataDir, channelName);

  // Verifica si el directorio del canal existe
  if (!fs.existsSync(channelPath)) {
    res.status(404).send({ error: 'Channel not found' });
    return;
  }

  // Obtener todos los archivos JSON en el directorio del canal
  fs.readdir(channelPath, (err, files) => {
    if (err) {
      res.status(500).send({ error: 'Unable to read directory' });
      return;
    }

    // Filtrar los archivos JSON y ordenar por fecha
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
      res.status(404).send({ error: 'No JSON files found' });
      return;
    }

    // Encontrar el archivo más reciente
    const latestFile = jsonFiles.reduce((latest, file) => {
      const fileDate = new Date(file.replace('.json', ''));
      return !latest || fileDate > new Date(latest) ? file : latest;
    }, '');

    const latestFilePath = path.resolve(channelPath, latestFile);

    // Leer el archivo JSON más reciente
    fs.readFile(latestFilePath, 'utf8', (err, fileData) => {
      if (err) {
        res.status(500).send({ error: 'Unable to read file' });
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(fileData);
    });
  });
});

// Ruta para obtener un archivo JSON específico de un canal
app.get('/channel/:channelName/:fileName', (req, res) => {
  const { channelName, fileName } = req.params;
  const channelPath = path.resolve(dataDir, channelName);
  const filePath = path.resolve(channelPath, fileName);

  // Verifica si el archivo existe
  if (!fs.existsSync(filePath)) {
    res.status(404).send({ error: 'File not found' });
    return;
  }

  // Leer el archivo JSON específico
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      res.status(500).send({ error: 'Unable to read file' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(fileData);
  });
});

// Inicia el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
