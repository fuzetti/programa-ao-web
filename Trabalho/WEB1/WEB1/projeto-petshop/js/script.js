// js/script.js
let pets = [];
let editIndex = null;
let currentSortAsc = true;
let currentFilterSpecies = '';

// Função para salvar no localStorage
function salvarPets() {
    localStorage.setItem('petshop_pets', JSON.stringify(pets));
}

// Função para carregar do localStorage
function carregarPets() {
    const dados = localStorage.getItem('petshop_pets');
    if (dados) {
        pets = JSON.parse(dados);
    }
}

// Função para renderizar a tabela
window.atualizarTabela = function() {
    const tabelaBody = document.querySelector('.tabela-pets');
    if (!tabelaBody) return;
    tabelaBody.innerHTML = '';
    // Preserve original indices so actions map to the correct item
    const withIndex = pets.map((p, idx) => ({ pet: p, origIndex: idx }));

    const exibicaoPets = withIndex
        .filter(item => !currentFilterSpecies || item.pet.especie === currentFilterSpecies)
        .sort((a, b) => {
            return currentSortAsc
                ? a.pet.nome.localeCompare(b.pet.nome, 'pt-BR', { sensitivity: 'base' })
                : b.pet.nome.localeCompare(a.pet.nome, 'pt-BR', { sensitivity: 'base' });
        });

    if (exibicaoPets.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" style="text-align:center; padding: 20px;">Nenhum pet encontrado.</td>';
        tabelaBody.appendChild(tr);
        return;
    }

    exibicaoPets.forEach(item => {
        const pet = item.pet;
        const orig = item.origIndex;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.dono}</td>
            <td>${pet.idade}</td>
            <td>${pet.porte}</td>
            <td>${pet.vacinado ? 'Sim' : 'Não'}</td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicao(${orig})">Editar</button>
                <button class="btn btn-deletar" onclick="excluirPet(${orig})">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
};

// CREATE / UPDATE - Capturando o formulário que vem do article.html
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'form-pet') {
        e.preventDefault();
        document.querySelectorAll('.erro-campo').forEach(el => el.remove());

        // Captura campos
        const nome = document.getElementById('nomePet').value.trim();
        const especie = document.getElementById('especiePet').value;
        const dono = document.getElementById('donoPet').value.trim();
        const idade = document.getElementById('idadePet').value;
        const porte = document.getElementById('portePet').value;
        const vacinado = document.getElementById('vacinadoPet').checked;

        let valido = true;

        // [VALIDAÇÃO 1] Nome obrigatório
        if (!nome) {
            mostrarErro('nomePet', 'O nome é obrigatório.');
            valido = false;
        }
        // [VALIDAÇÃO 2] Idade maior que zero
        if (!idade || Number(idade) <= 0) {
            mostrarErro('idadePet', 'A idade deve ser maior que zero.');
            valido = false;
        }

        if (!valido) return;

        const pet = { nome, especie, dono, idade, porte, vacinado };

        if (editIndex !== null) {
            pets[editIndex] = pet;
            editIndex = null;
            document.querySelector('.btn-salvar').textContent = 'Cadastrar Pet';
        } else {
            pets.push(pet);
        }

        e.target.reset();
        atualizarTabela();
        salvarPets();
    }
});

function mostrarErro(id, mensagem) {
    const campo = document.getElementById(id);
    const erro = document.createElement('div');
    erro.className = 'erro-campo';
    erro.style.color = '#B00020';
    erro.style.fontSize = '13px';
    erro.style.marginTop = '2px';
    erro.textContent = mensagem;
    campo.parentNode.appendChild(erro);
}

// DELETE
window.excluirPet = function(index) {
    if (confirm("Deseja realmente excluir este pet?")) {
        pets.splice(index, 1);
        salvarPets();
        atualizarTabela();
    }
};

// PREPARAR UPDATE
window.prepararEdicao = function(index) {
    const pet = pets[index];
    document.getElementById('nomePet').value = pet.nome;
    document.getElementById('especiePet').value = pet.especie;
    document.getElementById('donoPet').value = pet.dono;
    document.getElementById('idadePet').value = pet.idade;
    document.getElementById('portePet').value = pet.porte;
    document.getElementById('vacinadoPet').checked = pet.vacinado;
    editIndex = index;
    document.querySelector('.btn-salvar').textContent = 'Salvar Alterações';
};

// Função de filtro por espécie
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'filtroEspecie') {
        currentFilterSpecies = e.target.value;
        atualizarTabela();
    }
});

// Função do botão Limpar e do botão de ordenar
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-limpar') {
        document.getElementById('form-pet').reset();
        document.querySelectorAll('.erro-campo').forEach(el => el.remove());
        editIndex = null;
        document.querySelector('.btn-salvar').textContent = 'Cadastrar Pet';
        currentFilterSpecies = '';
        const filtro = document.getElementById('filtroEspecie');
        if (filtro) filtro.value = '';
        atualizarTabela();
    }

    if (e.target && e.target.id === 'btn-ordenar-nome') {
        currentSortAsc = !currentSortAsc;
        e.target.textContent = currentSortAsc ? 'Ordenar por Nome A-Z' : 'Ordenar por Nome Z-A';
        atualizarTabela();
    }
});
