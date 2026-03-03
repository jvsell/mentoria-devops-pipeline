const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'mentoria-devops-pipeline',
    description: 'Demo site para pipeline CI/CD',
    buildDate: process.env.BUILD_DATE || 'local',
    commitSha: process.env.COMMIT_SHA || 'local',
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = { app, server };
