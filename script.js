let boolJogando = false,
    camposOcultos = 0,
    tempoDeJogo = 0
    matriz = [];

const limiteMinimoLinhaColuna = 6,
      limiteMaximoLinhaColuna = 15,
      tempoMaximo = 999;

const elemento = {
    inputMinas: document.getElementById("qtdBombas"),
    inputLinhas: document.getElementById("altura"),
    inputColunas: document.getElementById("largura"),
    Linhas_e_colunas: document.querySelectorAll("#proporcao > input"),
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
    confirmacao: 'Voltar a tela inicial?'
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

voltar.onclick = (e) => {
    mostrarMensagem(document.getElementById("confirmacao"), text.confirmacao)
};

//Limitação dos valores do input (linha e coluna)
elemento.Linhas_e_colunas.forEach((element) => {
    element.onchange = (e) => {

        if(e.target.value < limiteMinimoLinhaColuna) e.target.value = limiteMinimoLinhaColuna;
        else if(e.target.value > limiteMaximoLinhaColuna) e.target.value = limiteMaximoLinhaColuna;
        
        if(elemento.inputMinas.value > elemento.inputLinhas.value * elemento.inputColunas.value){
            elemento.inputMinas.value = elemento.inputLinhas.value * elemento.inputColunas.value - 1
        }
    }
});

//Limitação do valor do input (Quantidade de bombas)
elemento.inputMinas.onchange = (e) => {   
    let l = elemento.inputLinhas.value
    let c = elemento.inputColunas.value

    if (e.target.value >= l*c) e.target.value = (l*c) -1;
    else if (e.target.value < 1) e.target.value = 1;
}

//Atualiza tempo de jogo
setInterval(function(){

    if(boolJogando && tempoDeJogo++ < tempoMaximo) elemento.lableTempo.textContent = ("000" + tempoDeJogo).slice(-3);
}, 1000);

function iniciarJogo(){

    //Define os atributos iniciais
    matriz = []
    boolJogando = true
    tempoDeJogo = elemento.lableTempo.textContent
    elemento.imgVoltar.style.display = "flex"
    elemento.telaConfiguracao.classList.remove("ativo")
    elemento.qtdBandeiras.textContent = elemento.inputMinas.value
    camposOcultos = elemento.inputColunas.value * elemento.inputLinhas.value

    for(l=0; l<elemento.inputLinhas.value; l++){

        matriz[l] = []
        for(c=0; c<elemento.inputColunas.value; c++) matriz[l][c] = 0
    }
    
    // Insere as minas e os numeros na matriz e retorna as coordenas das bombas
    let localBombas = criarCampo(matriz)
    
    elemento.areaCampoMinado.innerHTML = criarCampoHTML(matriz)
    elemento.areaCampoMinado.classList.add('ativo')
    elemento.statusJogo.classList.add('ativo')

    // Click do mouse nos campos
    document.querySelectorAll(".campo").forEach((element) => {

        element.onclick = (e) => {

            if(element.classList.contains("campoAberto") || e.target.classList.contains("bandeira")) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(matriz[l][c] == text.bomba) pararJogoEMostrarBombas(e.target, localBombas)            
            else if(matriz[l][c] == 0) AbrirEspacosVazios(matriz, l, c)
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
        let x = Math.round(Math.random() * (elemento.inputLinhas.value-1))
        let y = Math.round(Math.random() * (elemento.inputColunas.value-1))

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
                     <div id="fundoMensagem">
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

    if(camposOcultos == elemento.inputMinas.value && elemento.qtdBandeiras.textContent == 0) {
        boolJogando = false
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
    elemento.areaCampoMinado.className = ""
    elemento.telaConfiguracao.classList.add("ativo")
    elemento.statusJogo.className = ""
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

function resetarTempoDeJogo() {
    boolTempoMaximo = false
    elemento.lableTempo.textContent = "000"
}