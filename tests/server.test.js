const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.PORT = '0';

const { app, server } = require('../src/server');

let baseUrl;

before(() => new Promise((resolve) => {
  if (server.listening) {
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
    resolve();
  } else {
    server.once('listening', () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  }
}));

after(() => new Promise((resolve) => server.close(resolve)));

describe('GET /api/health', () => {
  it('deve retornar status 200', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
  });

  it('deve retornar JSON com campo status "ok"', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });

  it('deve conter os campos obrigatorios', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const body = await res.json();
    assert.ok(body.version, 'campo version ausente');
    assert.ok(body.environment, 'campo environment ausente');
    assert.ok(body.timestamp, 'campo timestamp ausente');
  });
});

describe('GET /api/info', () => {
  it('deve retornar status 200', async () => {
    const res = await fetch(`${baseUrl}/api/info`);
    assert.equal(res.status, 200);
  });

  it('deve retornar o nome da aplicacao', async () => {
    const res = await fetch(`${baseUrl}/api/info`);
    const body = await res.json();
    assert.equal(body.name, 'mentoria-devops-pipeline');
  });
});

describe('GET /', () => {
  it('deve retornar a pagina HTML', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType.includes('text/html'), `esperado text/html, recebido: ${contentType}`);
  });
});
