var cores = ["circulo", "triangulo", "quadrado", "x"];
var vetorID = [];

// criar os blocos
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
            bloco = moverBlocos();
        }
    });
}

// ID aleatorio
function geraId() {
    let aleatorio;

    do {
        aleatorio = Math.floor(Math.random() * 16);
    } while (vetorID.includes(aleatorio));

    vetorID.push(aleatorio);

    return aleatorio;
}

//mover os blocos
function moverBlocos() {
    var columns = document.querySelectorAll(".tubo");
    document.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
    });

    document.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        verificaBlocos();  // Chama a função de verificação após o movimento
    });

    columns.forEach((item) => {
        item.addEventListener("dragover", (e) => {
            const dragging = document.querySelector(".dragging");
            const applyAfter = getNewPosition(item, e.clientY);

            if (applyAfter) {
                applyAfter.insertAdjacentElement("afterend", dragging);
            } else {
                item.prepend(dragging);
            }
        });
    });

    var columns = document.querySelectorAll("#tubo-vazio");
    document.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
    });

    document.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        verificaBlocos(); 
    });

    columns.forEach((item) => {
        item.addEventListener("dragover", (e) => {
            const dragging = document.querySelector(".dragging");
            const applyAfter = getNewPosition(item, e.clientY);

            if (applyAfter) {
                applyAfter.insertAdjacentElement("afterend", dragging);
            } else {
                item.prepend(dragging);
            }
        });
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

//verifica se existe 4 blocos da mesma cor em uma coluna
function verificaBlocos() {
    var tubos = document.querySelectorAll(".tubo");

    tubos.forEach(function(tubo) {
        var blocos = tubo.querySelectorAll(".bloco");
        
        // Verifica se há 4 blocos ou mais no tubo
        if (blocos.length >= 4) {
            // Checa a sequência de 4 blocos da mesma cor
            for (let i = 0; i < blocos.length - 3; i++) {
                // Pega as cores dos blocos consecutivos
                let cor1 = blocos[i].classList[1]; // primeiro bloco
                let cor2 = blocos[i + 1].classList[1]; // segundo bloco
                let cor3 = blocos[i + 2].classList[1]; // terceiro bloco
                let cor4 = blocos[i + 3].classList[1]; // quarto bloco

                // Verifica se todos os blocos têm a mesma cor
                if (cor1 === cor2 && cor2 === cor3 && cor3 === cor4) {
                    // Se todos os blocos têm a mesma cor e exibe uma mensagem de vitória
                    console.log("Encontrados 4 blocos da mesma cor!");

                    // Verifica se todas as colunas estão corretas
                    verificarVitoria();
                    return;
                }
            }
        }
    });
}

// Função para verificar se todas as colunas estão corretas
function verificarVitoria() {
    var tubos = document.querySelectorAll(".tubo");
    var ganhou = true;

    tubos.forEach(function(tubo) {
        var blocos = tubo.querySelectorAll(".bloco");
        // Checa se a coluna tem 4 blocos da mesma cor
        if (blocos.length === 4) {
            let cor = blocos[0].classList[1];
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
        alert("Você ganhou!");
    }
}

// reset
function reset() {
    var containers = document.querySelectorAll(".tubo");

    containers.forEach(function(container) {
        container.innerHTML = "";
    });

    vetorID = [];
    criaBloco();
}
