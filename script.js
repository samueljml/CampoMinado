let boolJogando = false,
    camposOcultos = 0,
    tempoDeJogo = 0
    matriz = [];

const limiteMinimoColuna = 6,
      limiteMinimoLinha = 3,
      margemWidth = 100,
      margemHeight = 230,
      camposProporcao = 42,
      limiteMaximoLinha = parseInt((window.screen.height - margemHeight) / camposProporcao),
      limiteMaximoColuna = parseInt((window.screen.width - margemWidth) / camposProporcao),
      tempoMaximo = 999;

const elemento = {
    inputs: document.querySelectorAll("input"),
    inputMinas: document.getElementById("qtdBombas"),
    inputLinhas: document.getElementById("altura"),
    inputColunas: document.getElementById("largura"),
    Linhas_e_colunas: document.querySelectorAll("#proporcao > input"),
    linhas: document.getElementById("altura"),
    colunas: document.getElementById("largura"),
    statusJogo: document.getElementById("statusJogo"),
    areaCampoMinado: document.getElementById("areaCampo"),
    lableTempo: document.getElementById("labelTempo"),
    telaConfiguracao: document.getElementById("telaConfiguracao"),
    qtdBandeiras: document.getElementById("labelQtdBandeiras"),
    imgVoltar: document.getElementById("voltar")
}

const text = {
    bomba: "*",
    perdeu: 'Voce Perdeu!',
    ganhou: 'Voce Ganhou!',
    confirmacao: 'Voltar para tela inicial?'
}

const coloracaoNumeros = [
    "blue",
    "green",
    "red",
    "purple",
    "maroon",
    "#044",
    "black",
    "midnightblue"
]

// Exibir mensagem para voltar a tela inicial
voltar.onclick = (e) => {
    mostrarMensagem(document.getElementById("confirmacao"), text.confirmacao)
};

//Limitação dos valores do input (linha e coluna)
elemento.Linhas_e_colunas.forEach((element) => {
    element.onchange = (e) => {
        e.target.value = parseInt(0 + e.target.value)
        if(e.target.id == "altura") {
            checarLimites(e.target, limiteMinimoLinha, limiteMaximoLinha)
        }
        else {
            checarLimites(e.target, limiteMinimoColuna, limiteMaximoColuna)
        }

        checarLimites(e.target, 1,  (elemento.inputLinhas.value * elemento.inputColunas.value)-1)
    }
});

//Limitação do valor do input (Quantidade de bombas)
elemento.inputMinas.onchange = (e) => {   
    e.target.value = parseInt(0 + e.target.value)
    checarLimites(e.target, 1,  (elemento.inputLinhas.value * elemento.inputColunas.value)-1)
}


elemento.inputs.forEach((input) => {

    //Evitar valores decimais no input
    input.onkeypress = (e) => {
        if(isNaN(e.key)) {
            e.preventDefault();
        }
    }

    //Incrementar inputs com o scroll do mouse
    input.addEventListener('wheel', (event) => {
        event.preventDefault();
        incremento = -event.deltaY/100
    
        elemento.inputs.forEach((input) =>  {
            if(input === document.activeElement) {
                input.value = parseInt(input.value) + incremento
    
                checarLimites(elemento.inputLinhas, limiteMinimoLinha, limiteMaximoLinha)
                checarLimites(elemento.inputColunas, limiteMinimoColuna, limiteMaximoColuna)
                checarLimites(elemento.inputMinas, 1, (elemento.inputLinhas.value * elemento.inputColunas.value)-1)
            }
        })
    });
})

//Atualiza tempo de jogo
setInterval(function(){

    if(boolJogando && tempoDeJogo++ < tempoMaximo) elemento.lableTempo.textContent = ("000" + tempoDeJogo).slice(-3);
}, 1000);

function iniciarJogo(){

    matriz = []
    definirAtributosIniciaisDoJogo()

    for(l=0; l<elemento.inputColunas.value; l++){

        matriz[l] = []
        for(c=0; c<elemento.inputLinhas.value; c++) matriz[l][c] = 0
    }
    
    // Insere as minas e os numeros na matriz e retorna as coordenadas das bombas
    let localBombas = criarCampo(matriz)
    
    elemento.areaCampoMinado.innerHTML = criarCampoHTML(matriz)
    mostrarElemento(elemento.areaCampoMinado)
    mostrarElemento(elemento.statusJogo)

    // fundoMensagem maior se o campo for muito grande
    selectFundoMensagemClass()

    // Click do mouse nos campos
    document.querySelectorAll(".campo").forEach((element) => {

        element.onclick = (e) => {

            if(element.classList.contains("campoAberto") || e.target.classList.contains("bandeira")) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(matriz[l][c] == text.bomba) pararJogoEMostrarBombas(e.target, localBombas)            
            else if(matriz[l][c] == 0) {
                AbrirEspacosVazios(matriz, l, c)
                verificarVitoria()
            }
            else{
                
                mostrarNumero(e.target, matriz[l][c])
                trocarFundo(e.target, l+c)
                matriz[l][c] = undefined
                camposOcultos--
                verificarVitoria()
            }
        }
        element.oncontextmenu = (e) => {

            e.preventDefault();  
            if(e.target.classList.contains("campoAberto")) return

            if(e.target.classList.contains("bandeira")){

                e.target.classList.remove("bandeira")  
                elemento.qtdBandeiras.textContent++       
            }
            else if(elemento.qtdBandeiras.textContent > 0){
                
                e.target.classList.add("bandeira")
                elemento.qtdBandeiras.textContent--
                verificarVitoria()
            } 
        }
    })
}

function selectFundoMensagemClass(){
    let fundoMensagem = document.getElementById("fundoMensagem")
    if(elemento.inputLinhas.value > 14 && elemento.inputColunas.value > 29) {
        trocarClasse(fundoMensagem, "mensagem", "mensagemGrande")
    }
    else {
        if(fundoMensagem.classList.contains("mensagemGrande")) {
            trocarClasse(fundoMensagem, "mensagemGrande", "mensagem")
        }
    }
}

function definirAtributosIniciaisDoJogo() {
    boolJogando = true
    elemento.imgVoltar.style.display = "flex";
    tempoDeJogo = elemento.lableTempo.textContent
    ocultarElemento(elemento.telaConfiguracao)
    elemento.qtdBandeiras.textContent = elemento.inputMinas.value
    camposOcultos = elemento.inputColunas.value * elemento.inputLinhas.value
}

function trocarClasse(elementoAlvo, classeAntiga, classeNova){

    elementoAlvo.classList.remove(classeAntiga)
    elementoAlvo.classList.add(classeNova)
}

function trocarFundo(element, somaLinhaColuna){

    trocarClasse(element, "campoFechado", "campoAberto")
    if(somaLinhaColuna%2) trocarClasse(element, "campoFechadoEscuro", "campoAbertoEscuro")
}

function mostrarNumero(e, numero){

    e.textContent = numero
    e.style.color = coloracaoNumeros[parseInt(numero)-1]
}

function criarCampo(matriz){

    let qtdBombas = parseInt(elemento.inputMinas.value)
    let localBombas = []

    while(qtdBombas > 0){
        let x = Math.round(Math.random() * (elemento.inputColunas.value-1))
        let y = Math.round(Math.random() * (elemento.inputLinhas.value-1))

        if(matriz[x][y] != text.bomba){
            matriz[x][y] = text.bomba
            localBombas[localBombas.length] = [x, y]
            incrementarValores(matriz, x, y)
            qtdBombas--
        }
    }
    return localBombas
}

function incrementarValores(matriz, l, c){

    if(Number.isInteger(matriz[l][c-1])) matriz[l][c-1]++
    if(Number.isInteger(matriz[l][c+1])) matriz[l][c+1]++

    if(matriz[l-1] != undefined && Number.isInteger(matriz[l-1][c  ])) matriz[l-1][c  ]++
    if(matriz[l-1] != undefined && Number.isInteger(matriz[l-1][c-1])) matriz[l-1][c-1]++
    if(matriz[l-1] != undefined && Number.isInteger(matriz[l-1][c+1])) matriz[l-1][c+1]++

    if(matriz[l+1] != undefined && Number.isInteger(matriz[l+1][c  ])) matriz[l+1][c  ]++
    if(matriz[l+1] != undefined && Number.isInteger(matriz[l+1][c-1])) matriz[l+1][c-1]++
    if(matriz[l+1] != undefined && Number.isInteger(matriz[l+1][c+1])) matriz[l+1][c+1]++
}

function criarCampoHTML(matriz){
    let htmlFinal = `<div id="fundoParaEscurecer"></div> 
                     <div id="fundoMensagem" class="mensagem">
                     <div id="mensagemResultado"></div>
                        <div>
                            <button id="btnVoltar" onclick="voltarParaTelaInicial()">Voltar</button>
                        </div>
                        <div id="confirmacao">
                            <button onclick="voltarParaTelaInicial()">Sim</button>
                            <button onclick="cancelar()">Nao</button>
                        </div>
                     </div>`

    let fundoNormal = true;
    
    matriz.forEach((linhas) => {
   
        htmlFinal += '<div>'

        let i = 0;
        linhas.forEach((campo) => {

            if(fundoNormal) htmlFinal += '<div class="campo campoFechado" data-linha="' + matriz.indexOf(linhas) + '" data-coluna="' + (i++) + '"></div>'
            else htmlFinal += '<div class="campo campoFechado campoFechadoEscuro" data-linha="' + matriz.indexOf(linhas) + '" data-coluna="' + (i++) + '"></div>'
            
            fundoNormal = !fundoNormal
        })
        if(linhas.length%2 == 0) fundoNormal = !fundoNormal

        htmlFinal += '</div>'
    })
    return htmlFinal
}

function AbrirEspacosVazios(matriz, l, c){

    if(matriz[l] == undefined || matriz[l][c] == undefined) return
    
    let e = document.querySelector('div[data-linha="' + (l) + '"][data-coluna="' + (c) + '"]');
    
    trocarFundo(e, l+c)
    camposOcultos--

    if(e.classList.contains("bandeira")) {
        e.classList.remove("bandeira")
        elemento.qtdBandeiras.textContent++
    }

    if(matriz[l][c] > 0) {
        mostrarNumero(e, matriz[l][c])
        trocarFundo(e, l+c)
        matriz[l][c] = undefined
        return
    }
    matriz[l][c] = undefined

    AbrirEspacosVazios(matriz, l, c-1)
    AbrirEspacosVazios(matriz, l, c+1)
    AbrirEspacosVazios(matriz, l-1, c)
    AbrirEspacosVazios(matriz, l+1, c)
    AbrirEspacosVazios(matriz, l-1, c-1)
    AbrirEspacosVazios(matriz, l-1, c+1)
    AbrirEspacosVazios(matriz, l+1, c-1)
    AbrirEspacosVazios(matriz, l+1, c+1)
}

function pararJogoEMostrarBombas(campo, localBombas){

    boolJogando = false
    let i = 0

    mostrarBomba(campo)
    elemento.imgVoltar.style.display = "none";
    elemento.areaCampoMinado.classList.add("tremer")

    setInterval(function(){
        if(i < localBombas.length) {

            //Interromper 
            document.querySelectorAll(".campo").forEach((element) => {
                element.onclick = (e) => {
                    
                    while(i < localBombas.length-1) mostrarBombaDaPosicao(localBombas[i++])
                }
            })
            
            mostrarBombaDaPosicao(localBombas[i++])

            if(i == localBombas.length) mostrarMensagem(document.getElementById("btnVoltar"), text.perdeu)
        }

    }, 120-(localBombas.length/2));
}

function verificarVitoria(){

    if(camposOcultos == elemento.inputMinas.value) {
        boolJogando = false
        elemento.imgVoltar.style.display = "none";
        mostrarMensagem(document.getElementById("btnVoltar"), text.ganhou)  
    }
}

function mostrarBomba(campo){

    if(campo.classList.contains("campoFechadoEscuro")) trocarClasse(campo, "campoFechadoEscuro", "bomba")
    else trocarClasse(campo, "campoFechado", "bomba")
    campo.textContent = text.bomba
}

function mostrarBombaDaPosicao([x, y]){
    
    document.querySelector('div[data-linha="' + (x) + '"][data-coluna="' + (y) + '"]').textContent = text.bomba;
}

function voltarParaTelaInicial(){

    boolJogando = false
    resetarTempoDeJogo();
    removerClasses(elemento.areaCampoMinado)
    removerClasses(elemento.statusJogo)
    mostrarElemento(elemento.telaConfiguracao)
}

function cancelar() {
    document.getElementById("fundoParaEscurecer").classList.remove("fundoAtivo")
    document.getElementById("fundoMensagem").style.display = "none"
    document.getElementById("confirmacao").style.display = "none"
}

function mostrarMensagem(botoes, mensagem) {
    document.getElementById("fundoParaEscurecer").classList.add("fundoAtivo")
    document.getElementById("fundoMensagem").style.display = "flex"
    document.getElementById("mensagemResultado").textContent = mensagem
    botoes.style.display = "flex"
} 

function ocultarElemento(e) {
    e.classList.remove("ativo")
}

function mostrarElemento(e) {
    e.classList.add("ativo")
}

function removerClasses(e) {
    e.className = ""
}

function resetarTempoDeJogo() {
    boolTempoMaximo = false
    elemento.lableTempo.textContent = "000"
}

function checarLimites (elemento, limiteMinimo, limiteMaximo) {
    if(elemento.value < limiteMinimo) elemento.value = limiteMinimo
    else if(elemento.value > limiteMaximo) elemento.value = limiteMaximo
}