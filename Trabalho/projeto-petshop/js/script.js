// js/script.js
let pets = [];
let editIndex = null;

// Função para renderizar a tabela
window.atualizarTabela = function() {
    const tabelaBody = document.querySelector('.tabela-pets');
    if (!tabelaBody) return; // Se a tabela ainda não existir, pausa.
    
    tabelaBody.innerHTML = '';
    
    pets.forEach((pet, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.dono}</td>
            <td>
                <button class="btn btn-editar" onclick="prepararEdicao(${index})">Editar</button>
                <button class="btn btn-deletar" onclick="excluirPet(${index})">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
};

// CREATE / UPDATE - Capturando o formulário que vem do article.html
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'form-pet') {
        e.preventDefault(); // Impede a página de recarregar
        
        const pet = {
            nome: document.getElementById('nomePet').value,
            especie: document.getElementById('especiePet').value,
            dono: document.getElementById('donoPet').value
        };

        if (editIndex !== null) {
            pets[editIndex] = pet; // Atualiza pet existente
            editIndex = null;
            document.querySelector('.btn-salvar').textContent = 'Cadastrar Pet';
        } else {
            pets.push(pet); // Cria novo pet
        }

        e.target.reset(); // Limpa os campos
        atualizarTabela();
    }
});

// DELETE
window.excluirPet = function(index) {
    if (confirm("Deseja realmente excluir este pet?")) {
        pets.splice(index, 1);
        atualizarTabela();
    }
};

// PREPARAR UPDATE
window.prepararEdicao = function(index) {
    const pet = pets[index];
    document.getElementById('nomePet').value = pet.nome;
    document.getElementById('especiePet').value = pet.especie;
    document.getElementById('donoPet').value = pet.dono;
    
    editIndex = index;
    document.querySelector('.btn-salvar').textContent = 'Salvar Alterações';
};