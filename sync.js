const SYNC_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywPITfSjedOrEEIPIgeyAxL33JZ-QWRTw_rdgZx4WGz7P7TM4Ksi3ZLyEokTpOs9qg/exec";

function obterDataHojeBR() {
    return new Date().toLocaleDateString('pt-BR');
}

function registrarEnvioRecente() {
    localStorage.setItem('checklist_ultimo_envio', String(Date.now()));
}

function houveEnvioRecente(segundos = 6) {
    const ultimo = Number(localStorage.getItem('checklist_ultimo_envio') || 0);
    return (Date.now() - ultimo) < (segundos * 1000);
}

function verificarViradaDeDia() {
    const hoje = obterDataHojeBR();
    if (localStorage.getItem('checklist_data') !== hoje) {
        Object.keys(localStorage).forEach(chave => {
            if (chave.startsWith('checklist_concluidos')) {
                localStorage.removeItem(chave);
            }
        });
        localStorage.setItem('checklist_data', hoje);
    }
}

function obterChaveChecklist(estacao, turno) {
    return `checklist_concluidos_${estacao}_${turno}`;
}

function lerChecklistLocal(estacao, turno) {
    verificarViradaDeDia();
    return JSON.parse(localStorage.getItem(obterChaveChecklist(estacao, turno))) || [];
}

function salvarChecklistLocal(estacao, turno, lista) {
    verificarViradaDeDia();
    localStorage.setItem(obterChaveChecklist(estacao, turno), JSON.stringify(lista));
}

async function enviarChecklistOnline(estacao, turno, lista, onStatus) {
    salvarChecklistLocal(estacao, turno, lista);
    registrarEnvioRecente();
    if (onStatus) onStatus('sincronizando');

    try {
        await fetch(SYNC_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                tipo: 'checklist',
                data: obterDataHojeBR(),
                estacao: estacao,
                turno: turno,
                concluidos: lista
            })
        });
        registrarEnvioRecente();
        if (onStatus) onStatus('online');
    } catch (e) {
        console.error('Erro ao sincronizar checklist:', e);
        if (onStatus) onStatus('offline');
    }
}

async function buscarChecklistsOnline(onStatus) {
    verificarViradaDeDia();

    // Se houve alteração em qualquer página há menos de 6 segundos, preserva o estado local
    if (houveEnvioRecente(6)) {
        if (onStatus) onStatus('online');
        return null;
    }

    if (onStatus) onStatus('sincronizando');

    try {
        const hoje = encodeURIComponent(obterDataHojeBR());
        const resp = await fetch(`${SYNC_SCRIPT_URL}?tipo=checklist&data=${hoje}&t=${Date.now()}`);
        if (!resp.ok) throw new Error('Falha na resposta');

        const mapaNuvem = await resp.json();

        // Verifica novamente caso o usuário tenha clicado durante a requisição
        if (houveEnvioRecente(6)) {
            if (onStatus) onStatus('online');
            return null;
        }

        Object.keys(mapaNuvem).forEach(chave => {
            localStorage.setItem(`checklist_concluidos_${chave}`, JSON.stringify(mapaNuvem[chave]));
        });

        if (onStatus) onStatus('online');
        return mapaNuvem;
    } catch (e) {
        console.error('Erro ao buscar checklists online:', e);
        if (onStatus) onStatus('offline');
        return null;
    }
}

function iniciarSincronizacaoAutomatica(callbackSincronizar) {
    setInterval(() => {
        if (!document.hidden) {
            callbackSincronizar();
        }
    }, 45000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            callbackSincronizar();
        }
    });
}