// ==========================================
// CONFIGURAÇÃO CENTRAL DE FORMULÁRIOS E TAREFAS
// ==========================================
const formularios = [
    {
        id: "form_1",
        titulo: "1. CHECK-LIST DIÁRIO",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSc4v6_KL56tjJqakxfiiy4c0zPyR8ElrLbuv0aFtrZYO-GXLA/viewform"
    },
    {
        id: "form_2",
        titulo: "2. CHECK-LIST DEA",
        url: "https://docs.google.com/forms/d/1Uiq2Z85dtfQXVUfXPlFWl8kIqPLkMXTXzFLw_-5H6fU/viewform?edit_requested=true"
    },
    {
        id: "form_3",
        titulo: "3. QUIZ",
        url: "https://script.google.com/a/macros/metrobh.com.br/s/AKfycbzaS_b4hh9A1421iVJsr9qy0ur7krLMLmgjexrkRXWZIOcwu0ZyKPLjtSvx0L5JB3CB/exec"
    },
    {
        id: "form_4",
        titulo: "4. CHECK LIST ATM",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdYCd0Q0nhNq9eIgOBBBllZMWqLrbCgojTKJsIIeiToH_mxVQ/viewform"
    },
    {
        id: "form_5",
        titulo: "5. CHECK LIST BILHETERIA",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSczaFm92wFpjvR05Mt1rx2WoZFav8NR_H0EaTQT44QrOhqIxg/viewform"
    },
    // Itens internos (sem link externo -> vão automaticamente para tarefas.html)
    {
        id: "check_1",
        titulo: "Preencher formulário de Entrega/Recebimento Estação"
    },
    {
        id: "check_2",
        titulo: "Conferir e preencher formulário de conferência claviculário"
    },
    {
        id: "check_3",
        titulo: "Conferir e preencher formulário de conferência claviculário"
    },
    {
        id: "check_4",
        titulo: "Realizar DDS"
    },
    {
        id: "check_5",
        titulo: "(Lìderes) Realizar checklist da bilheteria"
    },
    {
        id: "check_6",
        titulo: "(Lìderes) Realizar lançamento de RAB’s e RVB"
    }
];

// ==========================================
// GERENCIAMENTO DE DATA E ESTADO COMPARTILHADO
// ==========================================
const hoje = new Date().toLocaleDateString('pt-BR');

// Verifica se o dia mudou para resetar os checks automaticamente
const dataSalva = localStorage.getItem('checklist_data');
if (dataSalva !== hoje) {
    localStorage.removeItem('checklist_concluidos');
    localStorage.setItem('checklist_data', hoje);
}

function obterConcluidos() {
    return JSON.parse(localStorage.getItem('checklist_concluidos')) || [];
}

function salvarConcluidos(lista) {
    localStorage.setItem('checklist_concluidos', JSON.stringify(lista));
}