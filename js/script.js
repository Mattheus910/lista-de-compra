// Seleção de elementos
const listaContainer = document.querySelector("#list-container");
const itemInput = document.querySelector("#item");
const quantidadeInput = document.querySelector("#quantidade");
const valorInput = document.querySelector("#valor");
const cadastrarBtn = document.querySelector("#list-form button");
const listForm = document.querySelector("#list-form");
const editForm = document.querySelector("#edit-form");
const editBtn = document.querySelector(".edit-btn");
const cancelBtn = document.querySelector(".cancel-edit-btn");
const list = document.querySelector("#lista");
const editItemInput = document.querySelector("#edit-item");
const editQuantidadeInput = document.querySelector("#edit-quantidade");
const editValorInput = document.querySelector("#edit-valor");

let oldItemValue;
let oldQuantidadeValue;
let oldValorValue;

// Funções

const adicionarItem = () => {

    if (itemInput.value !== "") {

        const itens = document.createElement("section");
        itens.classList.add("itens");
    
        const nomeItem = document.createElement("h4");
        nomeItem.innerText = itemInput.value;
        itens.appendChild(nomeItem);
    
        const quantidadeItem = document.createElement("p");
        quantidadeItem.classList.add("quantidade-item");
        quantidadeItem.innerText = quantidadeInput.value;
        itens.appendChild(quantidadeItem);
    
        const valorItem = document.createElement("p");
        valorItem.classList.add("valor-item");
        valorItem.innerText = `R$${Number(valorInput.value).toFixed(2).replace('.', ',')}`;
        itens.appendChild(valorItem);
    
        const valorTotalItem = document.createElement("p");
        valorTotalItem.innerText = `R$${(Number(valorInput.value) * Number(quantidadeInput.value)).toFixed(2).replace('.', ',')}`;
        itens.appendChild(valorTotalItem);
    
        const pegoBtn = document.createElement("button");
        pegoBtn.classList.add("pego")
        pegoBtn.innerHTML = '<i class="bi, bi-check"></i>';
        itens.appendChild(pegoBtn);
    
        const editBtn = document.createElement("button");
        editBtn.classList.add("editar")
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
        itens.appendChild(editBtn);
    
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("excluir")
        removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        itens.appendChild(removeBtn);
    
        list.appendChild(itens);

        if (quantidadeInput.value === "") {
            quantidadeItem.innerText = 0;
        } else if(valorInput.value === ""){
            valorItem.innerText = "R$0";
            valorTotalItem.innerText = "R$0";
        }

        itemInput.value = "";
        quantidadeInput.value = "";
        valorInput.value = "";
    }


};



// Eventos

cadastrarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    adicionarItem();
});

document.addEventListener("click", (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest("section");

    oldValue = parentEl.querySelector("h4").innerText;
    oldQuantidadeValue = parentEl.querySelector(".quantidade-item").innerText;
    oldValorValue = parentEl.querySelector(".valor-item").innerText;
    
    


    if (targetEl.classList.contains("pego")){
        parentEl.classList.toggle("done");
    };

    if (targetEl.classList.contains("excluir") || targetEl.classList.contains("bi bi-x-lg")){
        parentEl.remove();
    };

    if (targetEl.classList.contains("editar")){
        listForm.style.display = "none";
        editForm.style.display = "flex";
        list.style.display = "none";

        editItemInput.value = oldValue;
        editQuantidadeInput.value = oldQuantidadeValue;
        editValorInput.value = oldValorValue;
    };

});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();

    listForm.style.display = "flex";
    editForm.style.display = "none";
    list.style.display = "block";
});












