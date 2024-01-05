// Seleção de elementos
const listaContainer = document.querySelector("#list-container");
const itemInput = document.querySelector("#item");
const quantidadeInput = document.querySelector("#quantidade");
const valorInput = document.querySelector("#valor");
const cadastrarBtn = document.querySelector("#list-form button");
const listForm = document.querySelector("#list-form");
const editForm = document.querySelector("#edit-form");
const editBtn = document.querySelector("#edit-btn");
const cancelBtn = document.querySelector("#cancel-edit-btn");
const list = document.querySelector("#lista");
const editItemInput = document.querySelector("#edit-item");
const editQuantidadeInput = document.querySelector("#edit-quantidade");
const editValorInput = document.querySelector("#edit-valor");
const filterBtn = document.querySelector("#filter");
const searchInput = document.querySelector("#search");
const precoTotal = document.querySelector(".preco-total p");

let nomeAntigo;
let quantidadeAntiga;
let valorAntigo;

// Funções

const numberColors = () => {
    const itens = document.querySelectorAll(".itens");
    const atencao = document.querySelector(".atencao");
    let algumValorVermelho = false;

    itens.forEach((item) => {
        const quantidade = item.querySelector(".quantidade-item");
        const valor =  item.querySelector(".valor-item");
        const valorTotal =  item.querySelector(".valor-total");

        quantidade.innerText = quantidade.innerText === "" ? 0 : quantidade.innerText;
        quantidade.style.color = quantidade.innerText === "0" ? '#d51e1e' : 'black';

        valor.innerText = valor.innerText === "R$0,00" ? "R$0,00" : valor.innerText;
        valor.style.color = valor.innerText === "R$0,00" ? '#d51e1e' : 'black';

        valorTotal.innerText = valorTotal.innerText === "R$0,00" ? "R$0,00" : valorTotal.innerText;
        valorTotal.style.color = valorTotal.innerText === "R$0,00" ? '#d51e1e' : 'black';

        if (quantidade.innerText === "0" || valor.innerText === "R$0,00" || valorTotal.innerText === "R$0,00") {
            algumValorVermelho = true;
        }
    });


    if (algumValorVermelho) {
        atencao.innerText = '*';
        atencao.style.color = '#d51e1e';

    } else {
        atencao.innerText = '';
    }

};

const somaTotal = () => {
    const itens = document.querySelectorAll(".itens");
    let total = 0;

    itens.forEach((item) => {
        const preco = item.querySelector(".valor-total").innerText;
        const valorFormatado = Number(preco.replace("R$", "").replace(",", "."));
        total += valorFormatado; 
    });

    precoTotal.innerText = `R$${total.toFixed(2).replace('.', ',')}`;

};

const adicionarItem = (done = 0, save = 1, nomeItemTexto, quantidadeItemTexto, valorItemTexto, valorTotalItemTexto) => {
    if (nomeItemTexto !== "") {
        const itens = document.createElement("section");
        itens.classList.add("itens");

        const nomeItem = document.createElement("h4");
        nomeItem.innerText = nomeItemTexto;
        itens.appendChild(nomeItem);

        const quantidadeItem = document.createElement("p");
        quantidadeItem.classList.add("quantidade-item");
        quantidadeItem.innerText = quantidadeItemTexto;
        itens.appendChild(quantidadeItem);

        const valorItem = document.createElement("p");
        valorItem.classList.add("valor-item");
        valorItem.innerText = `R$${Number(valorItemTexto).toFixed(2).replace('.', ',')}`;
        itens.appendChild(valorItem);

        const valorTotalItem = document.createElement("p");
        valorTotalItem.classList.add("valor-total");
        valorTotalItem.innerText = `R$${(Number(valorItemTexto) * Number(quantidadeItemTexto)).toFixed(2).replace('.', ',')}`;
        itens.appendChild(valorTotalItem);

        const pegoBtn = document.createElement("button");
        pegoBtn.classList.add("pego");
        pegoBtn.innerHTML = '<i class="bi, bi-check"></i>';
        itens.appendChild(pegoBtn);

        const editBtn = document.createElement("button");
        editBtn.classList.add("editar");
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
        itens.appendChild(editBtn);

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("excluir");
        removeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        itens.appendChild(removeBtn);

        if (done) {
            itens.classList.add("done");
        }

        if (save) {
            saveItensLocalStorage({ nomeItemTexto, quantidadeItemTexto, valorItemTexto, valorTotalItemTexto, done });
        }

        list.appendChild(itens);

        numberColors();
    }

};

const adicionarItemFromInput = () => {
    adicionarItem(0, 1, itemInput.value, quantidadeInput.value, valorInput.value, "");
    itemInput.value = "";
    quantidadeInput.value = "";
    valorInput.value = "";
};

const updateTodo = (editInputValue, editQuantValue, editValorValue) => {
    const itens = document.querySelectorAll(".itens");

    itens.forEach((item) => {
        let itemTitle = item.querySelector("h4");
        let quantidadeTitle = item.querySelector(".quantidade-item");
        let valorTitle = item.querySelector(".valor-item");
        let valorTotalTitle = item.querySelector(".valor-total");

        if (itemTitle.innerText === nomeAntigo) {
            const newItem = {
                nomeItemTexto: editInputValue,
                quantidadeItemTexto: editQuantValue,
                valorItemTexto: parseFloat(editValorValue.replace("R$", "").replace(",", ".")),
                valorTotalItemTexto: parseFloat(editQuantValue) * parseFloat(editValorValue.replace("R$", "").replace(",", "."))
            };

            itemTitle.innerText = newItem.nomeItemTexto;
            quantidadeTitle.innerText = newItem.quantidadeItemTexto;
            valorTitle.innerText = `R$${newItem.valorItemTexto.toFixed(2).replace(".", ",")}`;
            valorTotalTitle.innerText = `R$${newItem.valorTotalItemTexto.toFixed(2).replace(".", ",")}`;

            updateListLocalStorage(nomeAntigo, newItem);
        }
    });
};

const filterList = (filterValue) => {
    const items = document.querySelectorAll(".itens");

    switch (filterValue) {
        case "all":
            items.forEach((itens) => itens.style.display = "flex");
            break;

        case "done":
            items.forEach((itens) => itens.classList.contains("done") ? (itens.style.display = "flex") : (itens.style.display = "none"));
            break;

        case "falt":
            items.forEach((itens) => !itens.classList.contains("done") ? (itens.style.display = "flex") : (itens.style.display = "none"));
            break;

        default:
            break;
    }
};

const getSearchedTodos = (search) => {
    const items = document.querySelectorAll(".itens");

    items.forEach((itens) => {
        const nomeItem = itens.querySelector("h4").innerText.toLowerCase();

        itens.style.display = "flex";

        if (!nomeItem.includes(search)) {
            itens.style.display = "none";
        }
    });
};

// Eventos

cadastrarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    adicionarItemFromInput();
    somaTotal()
    numberColors()

    itemInput.focus();
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("section");

    let oldValue;
    let oldQuantidadeValue;
    let oldValorValue;

    if (parentEl && parentEl.querySelector("h4")) {
        oldValue = parentEl.querySelector("h4").innerText;
        oldQuantidadeValue = parentEl.querySelector(".quantidade-item").innerText;
        oldValorValue = parentEl.querySelector(".valor-item").innerText;
    }

    if (targetEl.classList.contains("pego")) {
        parentEl.classList.toggle("done");

        updateListStatusLocalStorage(oldValue);
    }

    if (targetEl.classList.contains("excluir")) {
        parentEl.remove();

        removeItensLocalStorage(oldValue);
        somaTotal();
        numberColors();
    }

    if (targetEl.classList.contains("editar")) {
        listForm.style.display = "none";
        editForm.style.display = "flex";
        list.style.display = "none";

        editItemInput.value = oldValue;
        editQuantidadeInput.value = oldQuantidadeValue;
        editValorInput.value = parseFloat(oldValorValue.replace("R$", "").replace(",", ".")).toFixed(2);

        nomeAntigo = oldValue;
        quantidadeAntiga = oldQuantidadeValue;
        valorAntigo = oldValorValue;
    }
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    listForm.style.display = "flex";
    editForm.style.display = "none";
    list.style.display = "block";
});

editBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const editInputValue = editItemInput.value;
    const editQuantValue = editQuantidadeInput.value || 0;
    const editValorValue = editValorInput.value || 0;

    if (editInputValue) {
        updateTodo(editInputValue, editQuantValue, editValorValue);
    }

    listForm.style.display = "flex";
    editForm.style.display = "none";
    list.style.display = "block";

    numberColors();
    somaTotal();
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    filterList(filterValue);
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    getSearchedTodos(search);
});

// save local storage

const getItensLocalStorage = () => {
    const itens = JSON.parse(localStorage.getItem("itens")) || [];
    return itens;
};

const loadItems = () => {
    const itens = getItensLocalStorage();

    itens.forEach((item) => {
        adicionarItem(item.done, 0, item.nomeItemTexto, item.quantidadeItemTexto, item.valorItemTexto, item.valorTotalItemTexto);
    });
};

const saveItensLocalStorage = (item) => {
    const itens = getItensLocalStorage();
    itens.push(item);
    localStorage.setItem("itens", JSON.stringify(itens));
};

const removeItensLocalStorage = (oldValue) => {

    const itens = getItensLocalStorage();

    const filteredItens = itens.filter((item) => item.nomeItemTexto !== oldValue);

    localStorage.setItem("itens", JSON.stringify(filteredItens));

};

const updateListStatusLocalStorage = (oldValue) => {
    const itens = getItensLocalStorage();

    itens.map((item) => item.nomeItemTexto === oldValue ? (item.done = !item.done) : null );

    localStorage.setItem("itens", JSON.stringify(itens));

};

function updateListLocalStorage(oldValue, newItem) {
    const itens = getItensLocalStorage();
    const itemExistente = itens.find((item) => item.nomeItemTexto === oldValue);
  
    if (itemExistente) {
      if (itemExistente.nomeItemTexto === newItem.nomeItemTexto &&
        itemExistente.quantidadeItemTexto === newItem.quantidadeItemTexto &&
        itemExistente.valorItemTexto === newItem.valorItemTexto &&
        itemExistente.valorTotalItemTexto === newItem.valorTotalItemTexto) {
        return;
      }
    }
  
    itens.forEach((item) => {
      if (item.nomeItemTexto === oldValue) {
        item.nomeItemTexto = newItem.nomeItemTexto;
        item.quantidadeItemTexto = newItem.quantidadeItemTexto;
        item.valorItemTexto = newItem.valorItemTexto;
        item.valorTotalItemTexto = newItem.valorTotalItemTexto;
      }
    });
  
    localStorage.setItem("itens", JSON.stringify(itens));
  }

document.addEventListener("DOMContentLoaded", () => {
    loadItems();
    somaTotal()
});
