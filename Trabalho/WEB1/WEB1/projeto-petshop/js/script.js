// lógica inicial para CRUDL de pets
const pets = [];

function atualizarTabela() {
    const tabela = document.querySelector('.tabela-pets');
    if (!tabela) return;
    tabela.innerHTML = '';
    pets.forEach((pet, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.dono}</td>
            <td><button onclick="editarPet(${index})">Editar</button> <button onclick="excluirPet(${index})">Excluir</button></td>
        `;
        tabela.appendChild(row);
    });
}

function adicionarPet(pet) {
    pets.push(pet);
    atualizarTabela();
}

function excluirPet(i) {
    pets.splice(i, 1);
    atualizarTabela();
}

function editarPet(i) {
    // preencher formulário para edição
}
