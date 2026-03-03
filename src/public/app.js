// ── Pipeline animation ─────────────────────────────────────────
const STAGES = [
  { id: 'stage-code',   caption: 'Código enviado com git push...' },
  { id: 'stage-test',   caption: 'Rodando testes automatizados...' },
  { id: 'stage-build',  caption: 'Gerando artefatos de build...' },
  { id: 'stage-deploy', caption: 'Fazendo deploy para GitHub Pages...' },
  { id: 'stage-live',   caption: 'Aplicação em produção!' },
];

function animatePipeline() {
  const caption = document.getElementById('pipeline-caption');
  let index = 0;

  function runStage() {
    if (index >= STAGES.length) return;

    const { id, caption: text } = STAGES[index];
    const el = document.getElementById(id);

    el.classList.add('running');
    caption.textContent = text;

    setTimeout(() => {
      el.classList.remove('running');
      el.classList.add('done');
      index++;

      if (index < STAGES.length) {
        setTimeout(runStage, 300);
      } else {
        caption.textContent = 'Pipeline concluída com sucesso.';
      }
    }, 900);
  }

  setTimeout(runStage, 600);
}

// ── Build info ─────────────────────────────────────────────────
async function loadBuildInfo() {
  try {
    const res = await fetch('build-info.json');
    if (!res.ok) throw new Error('build-info.json não encontrado');
    const info = await res.json();

    document.getElementById('info-status').textContent = 'ok';
    document.getElementById('info-version').textContent = info.version || '—';
    document.getElementById('info-env').textContent    = info.environment || '—';
    document.getElementById('info-commit').textContent = info.commitSha   || '—';
    document.getElementById('info-date').textContent   = info.buildDate
      ? new Date(info.buildDate).toLocaleString('pt-BR')
      : '—';
  } catch {
    document.getElementById('info-status').textContent = 'local dev';
  }
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  animatePipeline();
  loadBuildInfo();
});
