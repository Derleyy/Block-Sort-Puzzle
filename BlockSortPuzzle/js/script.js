var cores = ["circulo", "triangulo", "quadrado", "x"];
var vetorID = [];
var pontua = 0;

// Função responsável por criar os blocos
function criaBloco() {
    var containers = document.querySelectorAll(".tubo");
    var tuboVazio = document.querySelector("#tubo-vazio");

    tuboVazio.innerHTML = "";

    containers.forEach(function(container) {
        for (let i = 0; i < 4; i++) {
            var bloco = document.createElement("div");

            bloco.setAttribute("draggable", "true");

            var id = geraId();
            bloco.setAttribute("id", id);

            let classe = parseInt(id / 4);
            bloco.setAttribute("class", "bloco " + cores[classe]);

            container.appendChild(bloco);
        }
    });

    moverBlocos();  // Garantir que o evento de movimento seja inicializado após a criação dos blocos
}

// Função para gerar ID aleatório
function geraId() {
    let aleatorio;

    do {
        aleatorio = Math.floor(Math.random() * 16);
    } while (vetorID.includes(aleatorio));

    vetorID.push(aleatorio);

    return aleatorio;
}

// Função responsável por mover os blocos
function moverBlocos() {
    var columns = document.querySelectorAll(".tubo");
    
    // Remover e adicionar apenas um evento de "dragover"
    columns.forEach((item) => {
        item.removeEventListener("dragover", onDragOver);
        item.addEventListener("dragover", onDragOver);
    });

    // Evento de 'dragstart' que adiciona a classe 'dragging'
    document.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
    });

    // Evento de 'dragend' que remove a classe 'dragging' e chama a função de verificação e pontuação
    document.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        verificaBlocos();  // Chama a função de verificação após o movimento
        mudarPontuação();  // Incrementa a pontuação após o movimento
    });
}

// Função para calcular a nova posição ao mover o bloco
function getNewPosition(column, posY) {
    const cards = column.querySelectorAll(".item:not(.dragging)");
    let result;

    for (let refer_card of cards) {
        const box = refer_card.getBoundingClientRect();
        const boxCenterY = box.y + box.height / 2;

        if (posY >= boxCenterY)
            result = refer_card;
    }

    return result;
}

// Função responsável por verificar se existe 4 blocos da mesma cor em uma coluna
function verificaBlocos() {
    const tubos = document.querySelectorAll(".tubo");

    tubos.forEach(function(tubo) {
        const blocos = tubo.querySelectorAll(".bloco");

        if (blocos.length >= 4) {
            // Checa a sequência de 4 blocos da mesma cor
            for (let i = 0; i < blocos.length - 3; i++) {
                const cor1 = blocos[i].classList[1];
                const cor2 = blocos[i + 1].classList[1];
                const cor3 = blocos[i + 2].classList[1];
                const cor4 = blocos[i + 3].classList[1];

                // Verifica se todos os blocos têm a mesma cor
                if (cor1 === cor2 && cor2 === cor3 && cor3 === cor4) {
                    console.log("Encontrados 4 blocos da mesma cor!");
                    verificarVitoria();
                    return;
                }
            }
        }
    });
}

// Função para verificar se todas as colunas estão corretas
function verificarVitoria() {
    const tubos = document.querySelectorAll(".tubo");
    let ganhou = true;

    tubos.forEach(function(tubo) {
        const blocos = tubo.querySelectorAll(".bloco");
        if (blocos.length === 4) {
            const cor = blocos[0].classList[1];
            // Verifica se todos os blocos da coluna têm a mesma cor
            for (let i = 1; i < blocos.length; i++) {
                if (blocos[i].classList[1] !== cor) {
                    ganhou = false;
                    break;
                }
            }
        } else {
            ganhou = false;
        }
    });

    if (ganhou) {
        // Mostrar a tela de vitória
        const telaVitoria = document.getElementById('tela-vitoria');
        telaVitoria.style.display = 'flex';
        
        // Aguardar 5 segundos e resetar o jogo
        setTimeout(() => {
            reset(); // Resetamos o jogo sem recarregar a página
            telaVitoria.style.display = 'none'; // Esconde a tela de vitória
        }, 5000);
    }
}

// Função responsável por pontuar e modificar o score
function mudarPontuação() {
    var contador = document.querySelector("#contador");

    pontua += 10;  // A cada movimento de bloco, adiciona 10 pontos
    contador.innerHTML = pontua;
}

// Função reset que irá apagar e criar novamente os quadrados via button
function reset() {
    var containers = document.querySelectorAll(".tubo");

    containers.forEach(function(container) {
        container.innerHTML = "";
    });

    vetorID = [];  // Limpa o vetorID
    pontua = 0;    // Reseta a pontuação
    document.querySelector("#contador").innerHTML = pontua; // Atualiza o contador na tela
    criaBloco();   // Cria os blocos novamente
}

// Função que trata o evento de 'dragover'
function onDragOver(e) {
    const dragging = document.querySelector(".dragging");
    const applyAfter = getNewPosition(e.currentTarget, e.clientY);

    if (applyAfter) {
        applyAfter.insertAdjacentElement("afterend", dragging);
    } else {
        e.currentTarget.prepend(dragging);
    }
}
