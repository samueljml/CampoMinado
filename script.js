let boolJogando = false,
    camposOcultos = 0,
    tempoDeJogo = 0;

const elemento = {
    inputMinas: document.getElementById("qtdBombas"),
    inputLinhas: document.getElementById("altura"),
    inputColunas: document.getElementById("largura"),
    Linhas_e_colunas: document.querySelectorAll(".proporcao"),
    telasJogo: document.getElementsByClassName("telasJogo"),
    statusJogo: document.getElementById("statusJogo"),
    areaCampoMinado: document.getElementById("areaCampo"),
    lableTempo: document.getElementById("labelTempo"),
    container: document.getElementsByClassName("container")[0],
    qtdBandeiras: document.getElementById("labelQtdBandeiras"),
    resultadoJogo: document.querySelectorAll("#statusJogo>.resultadoJogo")
}

const text = {
    bomba: "*",
    perdeu: 'Você Perdeu',
    ganhou: 'Você Ganhou'
}

const coloraçãoNumeros = [
    "blue",
    "green",
    "red",
    "purple",
    "maroon",
    "#044",
    "black",
    "midnightblue"
]

//Limitação dos valores do input (linha e coluna)
elemento.Linhas_e_colunas.forEach((element) => {
    element.onchange = (e) => {

        if(e.target.value < 3) e.target.value = 3;
        else if(e.target.value > 15) e.target.value = 15;
        
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

    if(boolJogando && tempoDeJogo++ < 999) elemento.lableTempo.textContent = ("000" + tempoDeJogo).slice(-3);
}, 1000);

var matriz = []

function iniciarJogo(){

    //Define os atributos iniciais
    boolJogando = true
    elemento.lableTempo.textContent = "000"
    elemento.qtdBandeiras.textContent = elemento.inputMinas.value
    camposOcultos = elemento.inputColunas.value * elemento.inputLinhas.value

    for(e of elemento.telasJogo) e.classList.add("enable")
    trocarClasse(elemento.container, "container", "disable")

    for(l=0; l<elemento.inputLinhas.value; l++){

        matriz[l] = []
        for(c=0; c<elemento.inputColunas.value; c++) matriz[l][c] = 0
    }
    
    // Insere as minas e os numeros na matriz e retorna as coordenas das bombas
    let localBombas = criarCampo(matriz)

    elemento.areaCampoMinado.innerHTML = criarCampoHTML(matriz)
    tornarCampoListrado(elemento.inputLinhas.value, elemento.inputColunas.value)

    // Click do mouse nos campos
    document.querySelectorAll('.campo').forEach((element) => {
        element.onclick = (e) => {

            if(!boolJogando || !campoDisponivel(e.target)) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(matriz[l][c] == text.bomba) jogoPerdido(e.target, localBombas)            
            else if(matriz[l][c] == 0) AbrirEspaçosVazios(matriz, l, c)
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
            if(!boolJogando) return            

            if(campoDisponivel(e.target) && elemento.qtdBandeiras.textContent > 0){

                e.target.classList.add("bandeira")
                elemento.qtdBandeiras.textContent--
                verificarVitoria()
            }
            else if(e.target.classList.contains("bandeira")){
                
                e.target.classList.remove("bandeira")
                elemento.qtdBandeiras.textContent++
            }  
        }
    })
}

function tornarCampoListrado(linhas, colunas){
    for(let l = 0; l < linhas; l++){
        for(let c = 0; c < colunas; c++){
            if((l+c)%2) document.querySelector('div[data-linha="' + (l) + '"][data-coluna="' + (c) + '"]').classList.add("campoFechado")
        }
    }
}

function trocarClasse(elementoAlvo, classeAntiga, classeNova){

    elementoAlvo.classList.remove(classeAntiga)
    elementoAlvo.classList.add(classeNova)
}

function campoDisponivel(campo){

    if(campo.textContent == '' && !campo.classList.contains("campoAberto") && !campo.classList.contains("bandeira")) return true
    return false
}

function trocarFundo(element, somaLinhaColuna){
    if(somaLinhaColuna%2) trocarClasse(element, "campoFechado", "campoAberto2")
    else element.classList.add("campoAberto")
}

function mostrarNumero(e, numero, soma){
    e.textContent = numero
    e.style.color = coloraçãoNumeros[parseInt(numero)-1]
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

    let htmlFinal = ''
    
    matriz.forEach((linhas) => {
        
        htmlFinal += '<div>'
        let i = 0;
        linhas.forEach((campo) => {
            htmlFinal += '<div class="campo" data-linha="' + matriz.indexOf(linhas) + '" data-coluna="' + (i++) + '"></div>'
        })
        htmlFinal += '</div>'
    })
    return htmlFinal
}

function AbrirEspaçosVazios(matriz, l, c){

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

    AbrirEspaçosVazios(matriz, l, c-1)
    AbrirEspaçosVazios(matriz, l, c+1)
    AbrirEspaçosVazios(matriz, l-1, c)
    AbrirEspaçosVazios(matriz, l+1, c)
    AbrirEspaçosVazios(matriz, l-1, c-1)
    AbrirEspaçosVazios(matriz, l-1, c+1)
    AbrirEspaçosVazios(matriz, l+1, c-1)
    AbrirEspaçosVazios(matriz, l+1, c+1)
}

function jogoPerdido(campo, localBombas){

    if(campo.classList.contains("campoFechado")) trocarClasse(campo, "campoFechado", "bomba")
    else campo.classList.add("bomba")
    campo.textContent = text.bomba
    boolJogando = false
    
    elemento.areaCampoMinado.classList.add("tremer")
    elemento.resultadoJogo[0].textContent = text.perdeu
    let i = 0

    setInterval(function(){
        if(i < localBombas.length) {

            elemento.areaCampoMinado.classList.add("campoEscurecido")

            //Interromper 
            document.querySelectorAll('#areaCampo > div > div').forEach((element) => {
                element.onclick = (e) => {
                    
                    while(i < localBombas.length-1) mostrarBomba(localBombas[i++])
                }
            })
            
            mostrarBomba(localBombas[i++])

            if(i == localBombas.length){
                
                for(e of elemento.resultadoJogo) e.classList.add("enable")
            }
        }

    }, 120-(localBombas.length));
}

function verificarVitoria(){
    if(camposOcultos == elemento.inputMinas.value && elemento.qtdBandeiras.textContent == 0){
        boolJogando = false

        elemento.resultadoJogo[0].textContent = text.ganhou
        for(e of elemento.resultadoJogo) e.classList.add("enable")
        elemento.areaCampoMinado.classList.add("campoEscurecido")
    }
}

function mostrarBomba([x, y]){
    document.querySelector('div[data-linha="' + (x) + '"][data-coluna="' + (y) + '"]').textContent = text.bomba;
}

function reiniciarJogo(){

    tempoDeJogo = 0
    boolTempoMaximo = false

    for(e of elemento.resultadoJogo) e.classList.remove("enable")
    for(e of elemento.telasJogo) e.classList.remove("enable")

    trocarClasse(elemento.container, "disable", "container")
    elemento.areaCampoMinado.classList.remove("campoEscurecido", "tremer")

}