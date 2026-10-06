/* =====================================================
   ROYAL CASH
   ===================================================== */


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const CONFIG = {

    saldoInicial: 10000,

    apostaInicial: 50,

    apostaMinima: 10,

    incrementoAposta: 10,

    pagamento: {

        cereja: 1.5,

        diamante: 1.5,

        saco: 2,

        sete: 10

    },

    progressoPorEvento: 20,

    quantidadeRodadasEspeciais: 3,

    delayEntreRodadas: 2000,

    duracaoRodadaEspecial: 4000

};


/* =====================================================
   ESTADO DO JOGO
===================================================== */

let saldo = CONFIG.saldoInicial;

let aposta = CONFIG.apostaInicial;

let progressoEspecial = 0;

let rodadasEspeciais = 0;

let girando = false;

let autoGiro = false;


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const balanceValue =
    document.getElementById("balanceValue");

const betValue =
    document.getElementById("betValue");

const specialProgress =
    document.getElementById("specialProgress");

const progressValue =
    document.getElementById("progressValue");

const result =
    document.getElementById("result");

const spinButton =
    document.getElementById("spinButton");

const autoButton =
    document.getElementById("autoButton");

const decreaseBet =
    document.getElementById("decreaseBet");

const increaseBet =
    document.getElementById("increaseBet");

const depositInput =
    document.getElementById("depositInput");

const depositButton =
    document.getElementById("depositButton");

const withdrawInput =
    document.getElementById("withdrawInput");

const withdrawButton =
    document.getElementById("withdrawButton");

const machine =
    document.getElementById("machine");


/* =====================================================
   SÍMBOLOS
===================================================== */

const simbolos = [

    "cereja",

    "diamante",

    "saco",

    "sete"

];


const pesos = {

    cereja: 40,

    diamante: 25,

    saco: 20,

    sete: 15

};


/* =====================================================
   ATUALIZAR INTERFACE
===================================================== */

function atualizarInterface() {

    balanceValue.textContent =
        saldo.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

    betValue.value = aposta;

    specialProgress.style.width =
        `${progressoEspecial}%`;

    progressValue.textContent =
        `${progressoEspecial}%`;

}


/* =====================================================
   SORTEAR SÍMBOLO
===================================================== */

function sortearSimbolo() {

    const totalPeso =
        Object.values(pesos)
            .reduce((a, b) => a + b, 0);

    let numero =
        Math.random() * totalPeso;


    for (const simbolo of simbolos) {

        numero -= pesos[simbolo];

        if (numero <= 0) {

            return simbolo;

        }

    }

    return "cereja";
}


/* =====================================================
   CRIAR ELEMENTO VISUAL
===================================================== */

function criarSimboloElemento(simbolo) {

    const elemento =
        document.createElement("div");

    elemento.className =
        "symbol-cell";


    if (simbolo === "sete") {

        const sete =
            document.createElement("span");

        sete.className = "seven";

        sete.textContent = "7";

        elemento.appendChild(sete);

    }

    else {

        const img =
            document.createElement("img");


        // CAMINHO CORRIGIDO PARA A PASTA ASSETS
        if (simbolo === "cereja") {

            img.src = "assets/cereja.png";

            img.alt = "Cereja";

        }

        else if (simbolo === "diamante") {

            img.src = "assets/diamante.png";

            img.alt = "Diamante";

        }

        else if (simbolo === "saco") {

            img.src = "assets/saco-moedas.png";

            img.alt = "Ouro";

        }


        elemento.appendChild(img);

    }


    return elemento;
}


/* =====================================================
   GERAR GRADE
===================================================== */

function gerarGrade() {

    const grade = [];

    for (let linha = 0; linha < 4; linha++) {

        grade[linha] = [];

        for (let coluna = 0; coluna < 5; coluna++) {

            grade[linha][coluna] =
                sortearSimbolo();

        }

    }

    return grade;
}


/* =====================================================
   MOSTRAR GRADE
===================================================== */

function mostrarGrade(grade) {

    const reels =
        document.querySelectorAll(".reel");


    for (let coluna = 0; coluna < 5; coluna++) {

        const cells =
            reels[coluna]
                .querySelectorAll(".symbol-cell");


        for (let linha = 0; linha < 4; linha++) {

            const antigo =
                cells[linha];

            const novo =
                criarSimboloElemento(
                    grade[linha][coluna]
                );


            antigo.replaceWith(novo);

        }

    }

}


/* =====================================================
   ANIMAÇÃO DOS ROLOS
===================================================== */

async function animarRolos(duracao) {

    const inicio =
        Date.now();


    while (Date.now() - inicio < duracao) {

        const grade =
            gerarGrade();

        mostrarGrade(grade);


        await esperar(65);

    }

}


/* =====================================================
   ESPERAR
===================================================== */

function esperar(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/* =====================================================
   ENCONTRAR LINHAS
===================================================== */

function analisarLinhas(grade) {

    const linhas = [];


    for (let linha = 0; linha < 4; linha++) {

        let inicio = 0;

        while (inicio < 5) {

            const simbolo =
                grade[linha][inicio];

            let fim =
                inicio + 1;


            while (
                fim < 5 &&
                grade[linha][fim] === simbolo
            ) {

                fim++;

            }


            const quantidade =
                fim - inicio;


            if (quantidade >= 3) {

                linhas.push({

                    orientacao: "horizontal",

                    simbolo: simbolo,

                    quantidade: quantidade,

                    linha: linha,

                    inicio: inicio,

                    fim: fim - 1

                });

            }


            inicio = fim;

        }

    }


    for (let coluna = 0; coluna < 5; coluna++) {

        let inicio = 0;

        while (inicio < 4) {

            const simbolo =
                grade[inicio][coluna];

            let fim =
                inicio + 1;


            while (
                fim < 4 &&
                grade[fim][coluna] === simbolo
            ) {

                fim++;

            }


            const quantidade =
                fim - inicio;


            if (quantidade >= 3) {

                linhas.push({

                    orientacao: "vertical",

                    simbolo: simbolo,

                    quantidade: quantidade,

                    coluna: coluna,

                    inicio: inicio,

                    fim: fim - 1

                });

            }


            inicio = fim;

        }

    }


    return linhas;

}


/* =====================================================
   DESTACAR LINHAS
===================================================== */

function destacarLinhas(linhas) {

    const reels =
        document.querySelectorAll(".reel");


    linhas.forEach(linha => {

        if (linha.orientacao === "horizontal") {

            const colunaInicial =
                linha.inicio;

            const colunaFinal =
                linha.fim;


            for (
                let coluna = colunaInicial;
                coluna <= colunaFinal;
                coluna++
            ) {

                const cell =
                    reels[coluna]
                        .querySelectorAll(".symbol-cell")[
                            linha.linha
                        ];


                cell.classList.add(
                    "winning-line",
                    "winning-horizontal"
                );

            }

        }


        else {

            const coluna =
                linha.coluna;


            for (
                let linhaIndex = linha.inicio;
                linhaIndex <= linha.fim;
                linhaIndex++
            ) {

                const cell =
                    reels[coluna]
                        .querySelectorAll(".symbol-cell")[
                            linhaIndex
                        ];


                cell.classList.add(
                    "winning-line",
                    "winning-vertical"
                );

            }

        }

    });

}


/* =====================================================
   LIMPAR LINHAS
===================================================== */

function limparLinhas() {

    document
        .querySelectorAll(".winning-line")
        .forEach(elemento => {

            elemento.classList.remove(
                "winning-line",
                "winning-horizontal",
                "winning-vertical"
            );

        });

}


/* =====================================================
   VERIFICAR RODADA ESPECIAL
===================================================== */

function verificarEspecial(linhas) {

    const evento =
        linhas.some(linha => {

            if (
                linha.quantidade !== 3 &&
                linha.quantidade !== 4
            ) {

                return false;

            }


            return (
                linha.simbolo === "sete" ||
                linha.simbolo === "saco"
            );

        });


    if (!evento) {

        return false;

    }


    progressoEspecial +=
        CONFIG.progressoPorEvento;


    if (progressoEspecial >= 100) {

        progressoEspecial = 100;

        rodadasEspeciais =
            CONFIG.quantidadeRodadasEspeciais;

        atualizarInterface();


        setTimeout(() => {

            progressoEspecial = 0;

            atualizarInterface();

        }, 600);


        return true;

    }


    atualizarInterface();

    return false;

}


/* =====================================================
   CALCULAR PRÊMIO
===================================================== */

function calcularPremio(linhas, apostaAtual, especial) {

    let premio = 0;

    const multiplicadorEspecial =
        especial ? 2 : 1;


    for (const linha of linhas) {

        if (
            linha.orientacao === "horizontal" &&
            linha.quantidade === 5
        ) {

            if (linha.simbolo === "sete") {

                premio +=
                    apostaAtual *
                    10 *
                    multiplicadorEspecial;

            }

            else if (
                linha.simbolo === "cereja"
            ) {

                premio +=
                    apostaAtual *
                    1.5 *
                    multiplicadorEspecial;

            }

            else if (
                linha.simbolo === "diamante"
            ) {

                premio +=
                    apostaAtual *
                    1.5 *
                    multiplicadorEspecial;

            }

            else if (
                linha.simbolo === "saco"
            ) {

                premio +=
                    apostaAtual *
                    2 *
                    multiplicadorEspecial;

            }

        }


        else if (
            linha.orientacao === "vertical" &&
            linha.quantidade === 4
        ) {

            premio +=
                apostaAtual *
                2 *
                multiplicadorEspecial;

        }

    }


    return premio;

}


/* =====================================================
   TEXTO DO RESULTADO
===================================================== */

function criarMensagemResultado(
    linhas,
    premio,
    especial
) {

    if (premio > 0) {

        const valor =
            premio.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        const jackpot =
            linhas.some(linha =>
                linha.orientacao === "horizontal" &&
                linha.quantidade === 5 &&
                linha.simbolo === "sete"
            );


        if (jackpot) {

            return `✦ JACKPOT — GANHOU ${valor} COINS`;

        }


        const linhaPremiada =
            linhas.find(linha => {

                return (
                    (
                        linha.orientacao === "horizontal" &&
                        linha.quantidade === 5
                    ) ||
                    (
                        linha.orientacao === "vertical" &&
                        linha.quantidade === 4
                    )
                );

            });


        if (linhaPremiada) {

            const nome =
                nomeSimbolo(
                    linhaPremiada.simbolo
                );


            return `${linhaPremiada.quantidade}x ${nome} — GANHOU ${valor} COINS`;

        }


        return `VOCÊ GANHOU ${valor} COINS`;

    }


    const eventoEspecial =
        linhas.some(linha => {

            return (
                (
                    linha.quantidade === 3 ||
                    linha.quantidade === 4
                ) &&
                (
                    linha.simbolo === "sete" ||
                    linha.simbolo === "saco"
                )
            );

        });


    if (eventoEspecial) {

        return "✦ RODADA ESPECIAL +20%";

    }


    return "NÃO GANHOU NADA — TENTE NOVAMENTE!";

}


/* =====================================================
   NOME DOS SÍMBOLOS
===================================================== */

function nomeSimbolo(simbolo) {

    switch (simbolo) {

        case "cereja":
            return "CEREJA";

        case "diamante":
            return "DIAMANTE";

        case "saco":
            return "OURO";

        case "sete":
            return "7";

        default:
            return "";

    }

}


/* =====================================================
   MENSAGEM GRANDE DE GANHO
===================================================== */

function mostrarMensagemGanho(valor) {

    let mensagem =
        document.getElementById("winMessage");


    if (!mensagem) {

        mensagem =
            document.createElement("div");

        mensagem.id =
            "winMessage";

        mensagem.className =
            "win-message";

        document.body.appendChild(
            mensagem
        );

    }


    const valorFormatado =
        valor.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    mensagem.innerHTML =
        `
        VOCÊ GANHOU
        <br>
        <span>
            ${valorFormatado} COINS
        </span>
        `;


    mensagem.classList.add("show");


    setTimeout(() => {

        mensagem.classList.remove("show");

    }, 1200);

}


/* =====================================================
   VERIFICAR JACKPOT
===================================================== */

function verificarJackpot(linhas) {

    return linhas.some(linha => {

        return (
            linha.orientacao === "horizontal" &&
            linha.quantidade === 5 &&
            linha.simbolo === "sete"
        );

    });

}


/* =====================================================
   RODADA
===================================================== */

async function girar() {

    if (girando) {

        return;

    }


    let apostaDigitada =
        Number(betValue.value);


    if (
        !Number.isFinite(apostaDigitada) ||
        apostaDigitada < CONFIG.apostaMinima
    ) {

        apostaDigitada =
            CONFIG.apostaMinima;

    }


    apostaDigitada =
        Math.round(
            apostaDigitada /
            CONFIG.incrementoAposta
        ) *
        CONFIG.incrementoAposta;


    aposta =
        apostaDigitada;


    betValue.value =
        aposta;


    if (saldo < aposta) {

        result.textContent =
            "SALDO INSUFICIENTE!";

        return;

    }


    girando = true;

    spinButton.disabled = true;


    machine.classList.remove(
        "jackpot-effect"
    );

    limparLinhas();


    const especial =
        rodadasEspeciais > 0;


    saldo -= aposta;

    atualizarInterface();


    if (especial) {

        machine.classList.add(
            "special-active"
        );

        await animarRolos(
            CONFIG.duracaoRodadaEspecial
        );

    }

    else {

        machine.classList.remove(
            "special-active"
        );

        await animarRolos(1000);

    }


    const grade =
        gerarGrade();


    mostrarGrade(
        grade
    );


    const linhas =
        analisarLinhas(
            grade
        );


    destacarLinhas(
        linhas
    );


    verificarEspecial(
        linhas
    );


    const premio =
        calcularPremio(
            linhas,
            aposta,
            especial
        );


    if (premio > 0) {

        saldo += premio;

    }


    result.textContent =
        criarMensagemResultado(
            linhas,
            premio,
            especial
        );


    if (
        verificarJackpot(linhas)
    ) {

        machine.classList.add(
            "jackpot-effect"
        );

    }


    if (premio > 0) {

        mostrarMensagemGanho(
            premio
        );

    }


    if (especial) {

        rodadasEspeciais--;

    }


    atualizarInterface();


    if (especial) {

        await esperar(500);

        machine.classList.remove(
            "special-active"
        );

    }


    if (!especial) {

        await esperar(
            CONFIG.delayEntreRodadas
        );

    }


    girando = false;

    spinButton.disabled = false;


    if (autoGiro) {

        if (saldo >= aposta) {

            await esperar(300);

            girar();

        }

        else {

            autoGiro = false;

            autoButton.textContent =
                "AUTO GIRO";

        }

    }

}


/* =====================================================
   DIMINUIR APOSTA
===================================================== */

decreaseBet.addEventListener(
    "click",
    () => {

        if (girando) {
            return;
        }


        aposta -=
            CONFIG.incrementoAposta;


        if (
            aposta <
            CONFIG.apostaMinima
        ) {

            aposta =
                CONFIG.apostaMinima;

        }


        betValue.value =
            aposta;

    }
);


/* =====================================================
   AUMENTAR APOSTA
===================================================== */

increaseBet.addEventListener(
    "click",
    () => {

        if (girando) {
            return;
        }


        aposta +=
            CONFIG.incrementoAposta;


        betValue.value =
            aposta;

    }
);


/* =====================================================
   DIGITAR APOSTA
===================================================== */

betValue.addEventListener(
    "change",
    () => {

        let valor =
            Number(
                betValue.value
            );


        if (
            !Number.isFinite(valor) ||
            valor < CONFIG.apostaMinima
        ) {

            valor =
                CONFIG.apostaMinima;

        }


        valor =
            Math.round(
                valor /
                CONFIG.incrementoAposta
            ) *
            CONFIG.incrementoAposta;


        aposta =
            valor;


        betValue.value =
            aposta;

    }
);


/* =====================================================
   GIRAR
===================================================== */

spinButton.addEventListener(
    "click",
    () => {

        girar();

    }
);


/* =====================================================
   AUTO GIRO
===================================================== */

autoButton.addEventListener(
    "click",
    () => {

        autoGiro =
            !autoGiro;


        if (autoGiro) {

            autoButton.textContent =
                "PARAR AUTO";

            if (!girando) {

                girar();

            }

        }

        else {

            autoButton.textContent =
                "AUTO GIRO";

        }

    }
);


/* =====================================================
   DEPOSITAR
===================================================== */

depositButton.addEventListener(
    "click",
    () => {

        const valor =
            Number(
                depositInput.value
            );


        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            return;

        }


        saldo += valor;


        depositInput.value = "";


        atualizarInterface();


        result.textContent =
            `SALDO RECARREGADO: ${valor.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2
                }
            )} COINS`;

    }
);


/* =====================================================
   SACAR
===================================================== */

withdrawButton.addEventListener(
    "click",
    () => {

        const valor =
            Number(
                withdrawInput.value
            );


        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            return;

        }


        if (valor > saldo) {

            result.textContent =
                "SALDO INSUFICIENTE PARA SACAR!";

            return;

        }


        saldo -= valor;


        withdrawInput.value = "";


        atualizarInterface();


        result.textContent =
            `SAQUE REALIZADO: ${valor.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2
                }
            )} COINS`;

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarInterface();


const gradeInicial =
    gerarGrade();


mostrarGrade(
    gradeInicial
);
