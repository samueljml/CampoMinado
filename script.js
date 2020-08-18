var boolJogando = true
var camposFechados = 0

var elemento = {
    inputMinas: document.getElementById("minas"),
    inputLinhas: document.getElementById("largura"),
    inputColunas: document.getElementById("altura"),
    tela1: document.getElementsByClassName("tela1"),
    tela2: document.getElementsByClassName("tela2"),
    lableTempo: document.getElementById("labelTempo"),
    areaCampoMinado: document.getElementById("areaCampo"),
    lableBandeiras: document.getElementById("labelQtdBandeiras"),
    resultadoJogo: document.querySelectorAll("#statusJogo>#resultadoJogo")
}
var src = {
    backgroundBomba: 'rgb(177, 59, 49)',
    backgroundNumber: 'rgb(103, 139, 131)',
    imgBandeira: 'url("assets/imgs/flag.png")'
}

var coloraçãoNumeros = [
    "blue",
    "green",
    "red",
    "purple",
    "maroon",
    "rgb(0, 56, 56)",
    "black",
    "midnightblue"
]

//Limitação dos valores do input (linha e coluna)
document.querySelectorAll(".container p input").forEach((element) => {
    element.onchange = (e) => {

        if(e.target.value < 3) e.target.value = 3;
        else if(e.target.value > 10) e.target.value = 10;
        
        if(elemento.inputMinas.value > elemento.inputLinhas.value * elemento.inputColunas.value){
            elemento.inputMinas.value = elemento.inputLinhas.value * elemento.inputColunas.value - 1
        }
    }
});

//Limitação dos valores do input (Quantidade de bombas)
elemento.inputMinas.onchange= (e) => {   
    let l = elemento.inputLinhas.value
    let c = elemento.inputColunas.value

    if (e.target.value >= l*c) e.target.value = (l*c) -1;
    else if (e.target.value < 1) e.target.value = 1;
}

setInterval(function(){
    if(boolJogando) elemento.lableTempo.textContent++
}, 1000);

function iniciarJogo(){

    boolJogando = true
    minasAbertas = 0
    elemento.lableTempo.textContent = 0;
    elemento.lableBandeiras.textContent = elemento.inputMinas.value
    camposFechados = elemento.inputColunas.value * elemento.inputLinhas.value

    setVisibilidadeTela(elemento.tela1, "none")
    setVisibilidadeTela(elemento.tela2, "flex")

    let matriz = []

    for(l=0; l<elemento.inputLinhas.value; l++){
        matriz[l] = []
        for(c=0; c<elemento.inputColunas.value; c++){
            matriz[l][c] = 0
        }
    }
    
    // Inserir as minas e os numeros
    criarCampo(matriz, parseInt(elemento.inputMinas.value))

    elemento.areaCampoMinado.innerHTML = criarCampoHTML(matriz)

    document.querySelectorAll('.container > #areaCampo > div > div').forEach((element) => {
        element.onclick = (e) => {

            if(!boolJogando) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(!element.textContent){
                if(matriz[l][c] == "*"){
                    e.target.textContent = "*"
                    element.style.background = src.backgroundBomba
                    jogoPerdido(matriz)
                }
                else if(matriz[l][c] == 0){
                    AbrirEspaçosVazios(matriz, l, c)
                }
                else{
                    element.textContent = matriz[l][c]
                    element.style.background = src.backgroundNumber
                    element.style.color = coloraçãoNumeros[parseInt(e.target.textContent)-1]
                    matriz[l][c] = undefined
                    camposFechados--
                    verificarVitoria()
                }
            }
        }
        element.oncontextmenu = (e) => {

            if(!boolJogando) return

            e.preventDefault();
            if(!e.target.textContent && element.style.background != src.backgroundNumber){
                if(element.style.content == ''){
                    if(elemento.lableBandeiras.textContent > 0){
                        element.style.content = src.imgBandeira
                        elemento.lableBandeiras.textContent--

                        verificarVitoria()
                    }
                }
                else if(element.style.content == src.imgBandeira){
                    element.style.content = ''
                    elemento.lableBandeiras.textContent++
                }  
            }  
        }
    })
}

function setVisibilidadeTela(tela, visibilidade){

    for(i=0; i<tela.length; i++){
        tela[i].style.display = visibilidade
    }
}

function criarCampo(matriz, qtdBombas){

    while(qtdBombas > 0){
        let x = Math.round(Math.random() * (elemento.inputLinhas.value-1))
        let y = Math.round(Math.random() * (elemento.inputColunas.value-1))

        if(matriz[x][y] != '*'){
            matriz[x][y]='*'
            incrementarValores(matriz, x, y)
            qtdBombas--
        }
    }
}

function incrementarValores(matriz, l, c){

    if(!isNaN(matriz[l][c-1])) matriz[l][c-1]++
    if(!isNaN(matriz[l][c+1])) matriz[l][c+1]++

    if(matriz[l-1] != undefined && !isNaN(matriz[l-1][c  ])) matriz[l-1][c  ]++
    if(matriz[l-1] != undefined && !isNaN(matriz[l-1][c-1])) matriz[l-1][c-1]++
    if(matriz[l-1] != undefined && !isNaN(matriz[l-1][c+1])) matriz[l-1][c+1]++

    if(matriz[l+1] != undefined && !isNaN(matriz[l+1][c  ])) matriz[l+1][c  ]++
    if(matriz[l+1] != undefined && !isNaN(matriz[l+1][c-1])) matriz[l+1][c-1]++
    if(matriz[l+1] != undefined && !isNaN(matriz[l+1][c+1])) matriz[l+1][c+1]++
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
    e.style.background = src.backgroundNumber

    camposFechados--

    if(matriz[l][c] != 0) {
        e.textContent = matriz[l][c]
        e.style.color = coloraçãoNumeros[  parseInt(matriz[l][c])-1  ] 
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

function jogoPerdido(matriz){
    for(l=0; l<matriz.length; l++){
        for(c=0; c<matriz[l].length; c++){
            if(matriz[l][c] == "*"){
                let e = document.querySelector('div[data-linha="' + (l) + '"][data-coluna="' + (c) + '"]');
                e.textContent = "*"
            }
        }
    }
    boolJogando = false
    elemento.resultadoJogo[0].textContent = "Você Perdeu"
    setVisibilidadeTela(elemento.resultadoJogo, "flex")
}

function jogoGanho(){
    boolJogando = false
    elemento.resultadoJogo[0].textContent = "Você Ganhou"
    setVisibilidadeTela(elemento.resultadoJogo, "flex")
}

function reiniciarJogo(){

    setVisibilidadeTela(elemento.tela2, "none")
    setVisibilidadeTela(elemento.tela1, "flex")
    setVisibilidadeTela(elemento.resultadoJogo, "none")
}

function verificarVitoria(){
    if(camposFechados == elemento.inputMinas.value && elemento.lableBandeiras.textContent == 0){
        jogoGanho()
    }
}