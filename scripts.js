//Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")


//Captura evento de input para formatar valor
amount.oninput = () => {
    //obtem valor atual do input e remove os caracteres não numericos
    let value = amount.value.replace(/\D/g,"")

    //Transfromar valor em centavos
    value = Number(value) / 100

    //atualiza valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    //formata valor no padrão de real brasileiro
    value = value.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    return value
}

//Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
    //Previne o comportamento padrão de recarregar a página no submit
    event.preventDefault()

    //Cria um objeto com os detalhes da despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    console.log(newExpense)

    //Chama a função que irá adicionar o item na lista
    expenseADD(newExpense)
}

// Adiciona um novo item na lista
function expenseADD(newExpense) {
    try{
        // Cria o elemento (li) para adicionar na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //Adiciona nome e categoria na div de informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        //Cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

        //Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //Adiciona o item na lista
        expenseList.append(expenseItem)

        //Limpa o formulário
        formClear()

        //Atualiza os totais
        updateTotals()

    }
    catch(error){
        alert("Não foi possível atualizar a lista de despesas")
    }
}

//Atualiza os totais
function updateTotals(){
    try{
        //Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        //Atualiza a quantidade de items da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //Variável para incrementar o total
        let total = 0

        //Percorre cada item (li) da lista
        for(let i = 0; i < items.length; i++){
            const itemAmount = items[i].querySelector(".expense-amount")

            // Remover caracteres não numéricos e substituir a vírgula por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g,"").replace(",",".")

            //Converte o valor para float
            value = parseFloat(value)

            //Verificar se é um número válido
            if(isNaN(value)) {
                return alert("Não foi possível retornar o total, o valor não parece ser um número")
            }

            //Incrementa o valor total
            total += Number(value)
        }

        //Cria a span para adicionar o R$ formatato
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //Formata o valor e remove o R$, que será exibido com estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //Limpa o contúdo do elemento
        expensesTotal.innerHTML = "" 

        //Adiciona o ímbolo da moeda e o valor total formatado
        expensesTotal.append(symbolBRL, total)
    }
    catch(error){
        console.log(error)
        alert("Não foi possível atualizar os totais")
    }
}

//Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
    //Verifica se o elemento clicado é o ícone de remover
    if (event.target.classList.contains("remove-icon")) {
        console.log(event)
        //Obtem a li pai do elemento selecionado
        const item = event.target.closest(".expense")

        //Remove o item da lista
        item.remove()
    }

    //Atualiza os totais
    updateTotals()
})

//Função para limpar campos após adicionar nova despesa
function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}