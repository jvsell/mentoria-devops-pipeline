#!/usr/bin/env node
/**
 * Build script — gera o site estático em dist/ pronto para GitHub Pages.
 *
 * Etapas:
 *   1. Limpa dist/
 *   2. Copia src/public/ para dist/
 *   3. Gera dist/build-info.json com metadados injetados pela pipeline
 *   4. Cria dist/.nojekyll (evita processamento Jekyll no GitHub Pages)
 */

const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'src', 'public');
const DIST = path.join(__dirname, 'dist');

function log(msg) { console.log(`[build] ${msg}`); }

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function build() {
  const start = Date.now();

  log('Limpando dist/...');
  rimraf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  log('Copiando arquivos estáticos...');
  copyDir(SRC, DIST);

  log('Gerando build-info.json...');
  const info = {
    buildDate:   new Date().toISOString(),
    commitSha:   process.env.COMMIT_SHA   || 'local',
    version:     process.env.APP_VERSION  || require('./package.json').version,
    environment: process.env.NODE_ENV     || 'development',
  };
  fs.writeFileSync(
    path.join(DIST, 'build-info.json'),
    JSON.stringify(info, null, 2)
  );

  // GitHub Pages ignora arquivos que começam com _ sem este arquivo
  log('Criando .nojekyll...');
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

  log(`Build concluído em ${Date.now() - start}ms → ${DIST}`);
}

build();
