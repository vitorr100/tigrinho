/* =========================================
   CONFIGURAÇÃO
========================================= */

const CONFIG = {

    saldoInicial: 10000,

    apostaInicial: 50,

    apostaMinima: 10,

    incrementoAposta: 10,

    pagamento: {

        cereja: 1.5,

        diamante: 1.5,

        saco: 2

    },

    jackpotInicial: 5000,

    progressoPorEvento: 20,

    quantidadeRodadasEspeciais: 3,

    delayEntreRodadas: 2000,

    duracaoRodadaEspecial: 4000

};



/* =========================================
   ELEMENTOS HTML
========================================= */

const balanceValue =
    document.getElementById(
        "balanceValue"
    );


const betValue =
    document.getElementById(
        "betValue"
    );


const specialProgress =
    document.getElementById(
        "specialProgress"
    );


const progressValue =
    document.getElementById(
        "progressValue"
    );


const specialCounter =
    document.getElementById(
        "specialCounter"
    );


const result =
    document.getElementById(
        "result"
    );


const spinButton =
    document.getElementById(
        "spinButton"
    );


const autoButton =
    document.getElementById(
        "autoButton"
    );


const decreaseBet =
    document.getElementById(
        "decreaseBet"
    );


const increaseBet =
    document.getElementById(
        "increaseBet"
    );


const machine =
    document.getElementById(
        "machine"
    );



/* =========================================
   VARIÁVEIS DO JOGO
========================================= */

let saldo =
    CONFIG.saldoInicial;


let aposta =
    CONFIG.apostaInicial;


let progressoEspecial = 0;


let rodadasEspeciais = 0;


let jogando = false;


let autoGirando = false;


let jackpot =
    CONFIG.jackpotInicial;



/* =========================================
   SÍMBOLOS
========================================= */

const SYMBOLS = {

    cereja: {

        nome: "CEREJA",

        imagem:
            "assets/cereja.png"

    },


    diamante: {

        nome: "DIAMANTE",

        imagem:
            "assets/diamante.png"

    },


    saco: {

        nome: "OURO",

        imagem:
            "assets/saco-moedas.png"

    },


    sete: {

        nome: "7"

    }

};



/* =========================================
   PESO DOS SÍMBOLOS
========================================= */

const SYMBOL_WEIGHTS = {

    cereja: 40,

    diamante: 25,

    saco: 20,

    sete: 15

};



/* =========================================
   FORMATAR NÚMEROS
========================================= */

function formatarNumero(numero) {

    return numero.toLocaleString(
        "pt-BR"
    );

}



/* =========================================
   ATUALIZAR INTERFACE
========================================= */

function atualizarInterface() {

    balanceValue.textContent =
        formatarNumero(
            saldo
        );


    betValue.textContent =
        formatarNumero(
            aposta
        );


    specialProgress.style.width =
        `${progressoEspecial}%`;


    progressValue.textContent =
        `${progressoEspecial}%`;


    if (
        rodadasEspeciais > 0
    ) {

        specialCounter.textContent =
            `✦ ${rodadasEspeciais} RODADA(S) ESPECIAL(IS) DISPONÍVEL(IS) ✦`;

    }

    else {

        specialCounter.textContent =
            "";

    }

}



/* =========================================
   ESCOLHER SÍMBOLO
========================================= */

function escolherSimbolo() {

    const total =
        Object.values(
            SYMBOL_WEIGHTS
        ).reduce(
            (a, b) => a + b,
            0
        );


    let sorteio =
        Math.random() * total;


    for (
        const simbolo in SYMBOL_WEIGHTS
    ) {

        sorteio -=
            SYMBOL_WEIGHTS[
                simbolo
            ];


        if (
            sorteio <= 0
        ) {

            return simbolo;

        }

    }


    return "cereja";

}



/* =========================================
   GERAR GRADE 5 x 4
========================================= */

function gerarGrade() {

    const grade = [];


    for (
        let coluna = 0;
        coluna < 5;
        coluna++
    ) {

        grade[coluna] = [];


        for (
            let linha = 0;
            linha < 4;
            linha++
        ) {

            grade[coluna][linha] =
                escolherSimbolo();

        }

    }


    return grade;

}



/* =========================================
   RENDERIZAR GRADE
========================================= */

function renderizarGrade(
    grade
) {

    const reels =
        document.querySelectorAll(
            ".reel"
        );


    for (
        let coluna = 0;
        coluna < 5;
        coluna++
    ) {

        for (
            let linha = 0;
            linha < 4;
            linha++
        ) {

            const celula =
                reels[coluna]
                    .children[linha];


            celula.className =
                "symbol-cell";


            celula.innerHTML =
                "";


            const simbolo =
                grade[coluna][linha];


            const dados =
                SYMBOLS[simbolo];


            if (
                simbolo === "sete"
            ) {

                celula.classList.add(
                    "seven"
                );


                celula.textContent =
                    "7";

            }

            else {

                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    dados.imagem;


                imagem.alt =
                    dados.nome;


                celula.appendChild(
                    imagem
                );

            }

        }

    }

}



/* =========================================
   ESPERAR
========================================= */

function esperar(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}



/* =========================================
   ANIMAÇÃO DOS SLOTS
========================================= */

async function animarReels(
    especial
) {

    const intervalo = 65;


    const quantidadeFrames =
        especial

            ? Math.floor(
                CONFIG.duracaoRodadaEspecial /
                intervalo
            )

            : 14;


    for (
        let frame = 0;
        frame < quantidadeFrames;
        frame++
    ) {

        renderizarGrade(
            gerarGrade()
        );


        await esperar(
            intervalo
        );

    }

}



/* =================================================
   ANALISAR LINHAS HORIZONTAIS E VERTICAIS
================================================= */

function analisarLinhas(
    grade
) {

    const linhas = [];


    /* =========================================
       HORIZONTAL
    ========================================= */

    for (
        let linha = 0;
        linha < 4;
        linha++
    ) {

        let simboloAtual =
            grade[0][linha];


        let inicio = 0;


        let quantidade = 1;


        for (
            let coluna = 1;
            coluna < 5;
            coluna++
        ) {

            const simbolo =
                grade[coluna][linha];


            if (
                simbolo ===
                simboloAtual
            ) {

                quantidade++;

            }

            else {

                if (
                    quantidade >= 3
                ) {

                    linhas.push({

                        tipo:
                            "horizontal",

                        linha:
                            linha,

                        simbolo:
                            simboloAtual,

                        inicio:
                            inicio,

                        fim:
                            coluna - 1,

                        quantidade:
                            quantidade

                    });

                }


                simboloAtual =
                    simbolo;


                inicio =
                    coluna;


                quantidade =
                    1;

            }

        }


        if (
            quantidade >= 3
        ) {

            linhas.push({

                tipo:
                    "horizontal",

                linha:
                    linha,

                simbolo:
                    simboloAtual,

                inicio:
                    inicio,

                fim:
                    4,

                quantidade:
                    quantidade

            });

        }

    }



    /* =========================================
       VERTICAL
    ========================================= */

    for (
        let coluna = 0;
        coluna < 5;
        coluna++
    ) {

        let simboloAtual =
            grade[coluna][0];


        let inicio = 0;


        let quantidade = 1;


        for (
            let linha = 1;
            linha < 4;
            linha++
        ) {

            const simbolo =
                grade[coluna][linha];


            if (
                simbolo ===
                simboloAtual
            ) {

                quantidade++;

            }

            else {

                if (
                    quantidade >= 3
                ) {

                    linhas.push({

                        tipo:
                            "vertical",

                        coluna:
                            coluna,

                        simbolo:
                            simboloAtual,

                        inicio:
                            inicio,

                        fim:
                            linha - 1,

                        quantidade:
                            quantidade

                    });

                }


                simboloAtual =
                    simbolo;


                inicio =
                    linha;


                quantidade =
                    1;

            }

        }


        if (
            quantidade >= 3
        ) {

            linhas.push({

                tipo:
                    "vertical",

                coluna:
                    coluna,

                simbolo:
                    simboloAtual,

                inicio:
                    inicio,

                fim:
                    3,

                quantidade:
                    quantidade

            });

        }

    }


    return linhas;

}



/* =========================================
   DESTACAR LINHAS
========================================= */

function destacarLinhas(
    linhas
) {

    const reels =
        document.querySelectorAll(
            ".reel"
        );


    linhas.forEach(
        linha => {


            /* HORIZONTAL */

            if (
                linha.tipo ===
                "horizontal"
            ) {

                for (
                    let coluna =
                        linha.inicio;

                    coluna <=
                        linha.fim;

                    coluna++
                ) {

                    reels[coluna]
                        .children[
                            linha.linha
                        ]
                        .classList.add(
                            "winning-line"
                        );

                }

            }


            /* VERTICAL */

            if (
                linha.tipo ===
                "vertical"
            ) {

                for (
                    let linhaAtual =
                        linha.inicio;

                    linhaAtual <=
                        linha.fim;

                    linhaAtual++
                ) {

                    reels[
                        linha.coluna
                    ]
                        .children[
                            linhaAtual
                        ]
                        .classList.add(
                            "winning-line"
                        );

                }

            }

        }
    );

}



/* =========================================================
   PROGRESSO DA RODADA ESPECIAL

   +20% SOMENTE:

   3x 7
   4x 7
   3x OURO
   4x OURO

   HORIZONTAL OU VERTICAL.

   5x NÃO CONTA.
========================================================= */

function verificarEspecial(
    linhas
) {

    /*
        Se já existem rodadas especiais,
        não acumula mais progresso.
    */

    if (
        rodadasEspeciais > 0
    ) {

        return;

    }


    /*
        Procura exatamente 3 ou 4
        de 7 ou OURO.
    */

    const eventoEspecial =
        linhas.some(
            linha => {

                return (

                    (
                        linha.quantidade === 3 ||
                        linha.quantidade === 4
                    )

                    &&

                    (
                        linha.simbolo === "sete" ||
                        linha.simbolo === "saco"
                    )

                );

            }
        );


    /*
        Se não encontrou,
        não aumenta.
    */

    if (
        !eventoEspecial
    ) {

        return;

    }


    /*
        AUMENTA 20%.
    */

    progressoEspecial +=
        CONFIG.progressoPorEvento;


    /*
        Limite de 100%.
    */

    if (
        progressoEspecial >= 100
    ) {

        progressoEspecial =
            100;


        atualizarInterface();


        ativarRodadaEspecial();


        return;

    }


    atualizarInterface();

}



/* =========================================
   ATIVAR RODADA ESPECIAL
========================================= */

function ativarRodadaEspecial() {

    rodadasEspeciais =
        CONFIG.quantidadeRodadasEspeciais;


    /*
        Zera a barra depois
        de liberar as rodadas.
    */

    progressoEspecial =
        0;


    result.textContent =
        "✦ RODADA ESPECIAL DESBLOQUEADA! ✦";


    result.style.color =
        "#ffe45c";


    atualizarInterface();

}



/* =========================================================
   CALCULAR PRÊMIOS

   SOMENTE 5 IGUAIS PAGAM.

   HORIZONTAL OU VERTICAL.
========================================================= */

function calcularPremio(
    linhas,
    especial
) {

    let premio = 0;


    let jackpotGanho =
        false;


    let mensagem = "";


    const linhasPagas =
        new Set();


    linhas.forEach(
        linha => {


            /*
                3 ou 4 NÃO PAGAM.
            */

            if (
                linha.quantidade !== 5
            ) {

                return;

            }


            /*
                Identificador da combinação.
            */

            const identificador =

                `${linha.tipo}-${linha.simbolo}-${linha.tipo === "horizontal"
                    ? linha.linha
                    : linha.coluna
                }-${linha.inicio}-${linha.fim}`;


            /*
                Evita duplicação.
            */

            if (
                linhasPagas.has(
                    identificador
                )
            ) {

                return;

            }


            linhasPagas.add(
                identificador
            );



            /* =====================================
               5x 7
               JACKPOT
            ===================================== */

            if (
                linha.simbolo ===
                "sete"
            ) {

                premio +=
                    jackpot;


                jackpotGanho =
                    true;


                mensagem =
                    `✦ JACKPOT! +${formatarNumero(jackpot)} COINS ✦`;


                return;

            }



            /* =====================================
               5x CEREJA
               5x DIAMANTE
               5x OURO
            ===================================== */

            const multiplicador =
                CONFIG.pagamento[
                    linha.simbolo
                ];


            if (
                multiplicador
            ) {

                /*
                    Rodada especial:
                    prêmio dobrado.
                */

                const multiplicadorEspecial =
                    especial
                        ? 2
                        : 1;


                const valor =
                    Math.floor(

                        aposta *

                        multiplicador *

                        multiplicadorEspecial

                    );


                premio +=
                    valor;


                mensagem =
                    `5x ${SYMBOLS[linha.simbolo].nome} — GANHOU ${formatarNumero(valor)} COINS!`;

            }

        }
    );


    return {

        premio,

        jackpotGanho,

        mensagem

    };

}



/* =========================================
   GIRAR
========================================= */

async function girar() {

    /*
        Não permite dois giros
        ao mesmo tempo.
    */

    if (
        jogando
    ) {

        return;

    }


    /*
        Verifica saldo.
    */

    if (
        saldo < aposta
    ) {

        result.textContent =
            "SALDO INSUFICIENTE";


        result.style.color =
            "#ff5c5c";


        return;

    }


    jogando =
        true;


    spinButton.disabled =
        true;


    /*
        Verifica se é rodada especial.
    */

    const especial =
        rodadasEspeciais > 0;


    /*
        Desconta aposta.
    */

    saldo -=
        aposta;


    atualizarInterface();


    /*
        Roda os slots.
    */

    await animarReels(
        especial
    );


    /*
        Gera resultado definitivo.
    */

    const grade =
        gerarGrade();


    renderizarGrade(
        grade
    );


    /*
        Analisa horizontal
        e vertical.
    */

    const linhas =
        analisarLinhas(
            grade
        );


    /*
        Mostra as linhas.
    */

    destacarLinhas(
        linhas
    );


    /*
        Verifica +20%.
    */

    verificarEspecial(
        linhas
    );


    /*
        Calcula prêmio.
    */

    const resultado =
        calcularPremio(
            linhas,
            especial
        );



    /* =========================================
       GANHOU
    ========================================= */

    if (
        resultado.premio > 0
    ) {

        saldo +=
            resultado.premio;


        /*
            JACKPOT
        */

        if (
            resultado.jackpotGanho
        ) {

            machine.classList.add(
                "jackpot-effect"
            );


            result.textContent =
                resultado.mensagem;


            result.style.color =
                "#fff09a";


            await esperar(
                2000
            );


            machine.classList.remove(
                "jackpot-effect"
            );

        }


        /*
            PRÊMIO NORMAL
        */

        else {

            machine.classList.add(
                "win-effect"
            );


            result.textContent =
                resultado.mensagem;


            result.style.color =
                "#ffe45c";


            await esperar(
                1000
            );


            machine.classList.remove(
                "win-effect"
            );

        }

    }


    /* =========================================
       SEM PRÊMIO
    ========================================= */

    else {

        /*
            Não mostra mensagem
            de prêmio.
        */

        result.textContent =
            "";

    }


    /*
        Consome uma rodada especial.
    */

    if (
        especial
    ) {

        rodadasEspeciais--;

    }


    atualizarInterface();


    /*
        Rodada normal espera 2 segundos.

        Especial já dura aproximadamente
        4 segundos.
    */

    if (
        !especial
    ) {

        await esperar(
            CONFIG.delayEntreRodadas
        );

    }


    jogando =
        false;


    spinButton.disabled =
        false;



    /* =========================================
       AUTO GIRO
    ========================================= */

    if (
        autoGirando &&
        saldo >= aposta
    ) {

        girar();

    }

    else {

        autoGirando =
            false;


        autoButton.textContent =
            "AUTO GIRO";

    }

}



/* =========================================
   BOTÃO -
========================================= */

decreaseBet.addEventListener(
    "click",
    () => {

        if (
            jogando
        ) {

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


        atualizarInterface();

    }
);



/* =========================================
   BOTÃO +
========================================= */

increaseBet.addEventListener(
    "click",
    () => {

        if (
            jogando
        ) {

            return;

        }


        if (
            aposta +
            CONFIG.incrementoAposta
            <= saldo
        ) {

            aposta +=
                CONFIG.incrementoAposta;

        }


        atualizarInterface();

    }
);



/* =========================================
   BOTÃO GIRAR
========================================= */

spinButton.addEventListener(
    "click",
    girar
);



/* =========================================
   AUTO GIRO
========================================= */

autoButton.addEventListener(
    "click",
    () => {

        if (
            jogando
        ) {

            autoGirando =
                !autoGirando;

        }

        else {

            autoGirando =
                true;


            girar();

        }


        if (
            autoGirando
        ) {

            autoButton.textContent =
                "PARAR AUTO";

        }

        else {

            autoButton.textContent =
                "AUTO GIRO";

        }

    }
);



/* =========================================
   DEPOSITAR
========================================= */

document
    .getElementById(
        "depositButton"
    )
    .addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "depositInput"
                );


            const valor =
                Number(
                    input.value
                );


            if (
                valor <= 0
            ) {

                return;

            }


            saldo +=
                valor;


            input.value =
                "";


            atualizarInterface();


            result.textContent =
                `+${formatarNumero(valor)} COINS ADICIONADOS`;


            result.style.color =
                "#62e58b";

        }
    );



/* =========================================
   SACAR
========================================= */

document
    .getElementById(
        "withdrawButton"
    )
    .addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "withdrawInput"
                );


            const valor =
                Number(
                    input.value
                );


            if (
                valor <= 0
            ) {

                return;

            }


            if (
                valor > saldo
            ) {

                result.textContent =
                    "SALDO INSUFICIENTE";


                result.style.color =
                    "#ff5c5c";


                return;

            }


            saldo -=
                valor;


            input.value =
                "";


            atualizarInterface();


            result.textContent =
                `-${formatarNumero(valor)} COINS SACADOS`;


            result.style.color =
                "#ffb0b0";

        }
    );



/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarInterface();


renderizarGrade(
    gerarGrade()
);