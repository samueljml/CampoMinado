let boolJogando = false
let boolTempoMaximo = false
let camposOcultos = 0

let elemento = {
    inputMinas: document.getElementById("minas"),
    inputLinhas: document.getElementById("largura"),
    inputColunas: document.getElementById("altura"),
    tela1: document.getElementsByClassName("tela1"),
    tela2: document.getElementsByClassName("tela2"),
    statusJogo: document.getElementById("statusJogo"),
    areaCampoMinado: document.getElementById("areaCampo"),
    lableTempo: document.querySelectorAll("#labelTempo>div"),
    container: document.getElementsByClassName("container")[0],
    lableBandeiras: document.getElementById("labelQtdBandeiras"),
    resultadoJogo: document.querySelectorAll("#statusJogo>#resultadoJogo")
}

let src = {
    bomba: "*",
    txtPerdeu: 'Você Perdeu',
    txtGanhou: 'Você Ganhou',
    escurecer: 'brightness(37%)',
    shakeAnimation: "shake 0.4s",
    backgroundBomba: 'rgb(177, 59, 49)',
    imgBandeira: 'url("assets/imgs/flag.png")',
    backgroundCampoAberto: 'rgb(103, 139, 131)'
}

let coloraçãoNumeros = [
    "blue",
    "green",
    "red",
    "purple",
    "maroon",
    "#003838",
    "black",
    "midnightblue"
]

let tempo = {
    unidade: elemento.lableTempo[2],
    dezena: elemento.lableTempo[1],
    centena: elemento.lableTempo[0]
}

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

//Limitação do valor do input (Quantidade de bombas)
elemento.inputMinas.onchange= (e) => {   
    let l = elemento.inputLinhas.value
    let c = elemento.inputColunas.value

    if (e.target.value >= l*c) e.target.value = (l*c) -1;
    else if (e.target.value < 1) e.target.value = 1;
}

//Atualiza tempo de jogo
setInterval(function(){
    if(boolJogando && !boolTempoMaximo){
        
        if(++tempo.unidade.textContent == 10){
            tempo.unidade.textContent = 0

            if(++tempo.dezena.textContent == 10) {
                tempo.dezena.textContent = 0
                tempo.centena.textContent++
            }
        }
        if(tempo.unidade.textContent == 9 && tempo.dezena.textContent == 9 && tempo.centena.textContent == 9) boolTempoMaximo = true
    } 
}, 1000);

var matriz = []

function iniciarJogo(){

    setVisibilidadeTela(elemento.tela1, "none")
    setVisibilidadeTela(elemento.tela2, "flex")

    boolJogando = true
    elemento.lableBandeiras.textContent = elemento.inputMinas.value
    camposOcultos = elemento.inputColunas.value * elemento.inputLinhas.value

    for(l=0; l<elemento.inputLinhas.value; l++){
        matriz[l] = []
        for(c=0; c<elemento.inputColunas.value; c++){
            matriz[l][c] = 0
        }
    }
    
    // Insere as minas e os numeros na matriz e retorna as coordenas das bombas
    let localBombas = criarCampo(matriz, parseInt(elemento.inputMinas.value))

    elemento.areaCampoMinado.innerHTML = criarCampoHTML(matriz)

    // Click do mouse nos campos
    document.querySelectorAll('#areaCampo > div > div').forEach((element) => {
        element.onclick = (e) => {

            if(!boolJogando || !campoDisponivel(e.target)) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(matriz[l][c] == src.bomba){
                e.target.textContent = src.bomba
                e.target.style.background = src.backgroundBomba
                jogoPerdido(localBombas)
            }
            else if(matriz[l][c] == 0) AbrirEspaçosVazios(matriz, l, c)
            else{
                mostarNumero(e.target, matriz[l][c])
                matriz[l][c] = undefined
                camposOcultos--

                verificarVitoria()
            }
            
        }
        element.oncontextmenu = (e) => {

            e.preventDefault();

            if(!boolJogando) return

            if(campoDisponivel(e.target)){
                if(elemento.lableBandeiras.textContent > 0){
                    e.target.style.content = src.imgBandeira
                    elemento.lableBandeiras.textContent--

                    verificarVitoria(camposOcultos)
                }
            }
            else if(e.target.style.content == src.imgBandeira){
                e.target.style.content = ''
                elemento.lableBandeiras.textContent++
            }  
        }
    })
}

function campoDisponivel(campo){
    if(campo.textContent == '' && campo.style.background != src.backgroundCampoAberto && campo.style.content != src. imgBandeira) return true
    return false
}

function mostarNumero(e, numero){
    e.textContent = numero
    e.style.background = src.backgroundCampoAberto
    e.style.color = coloraçãoNumeros[parseInt(numero)-1]
}

function setVisibilidadeTela(tela, visibilidade){

    for(i=0; i<tela.length; i++){
        tela[i].style.display = visibilidade
    }
}

function criarCampo(matriz, qtdBombas){

    let localBombas = []

    while(qtdBombas > 0){
        let x = Math.round(Math.random() * (elemento.inputLinhas.value-1))
        let y = Math.round(Math.random() * (elemento.inputColunas.value-1))

        if(matriz[x][y] != src.bomba){
            matriz[x][y] = src.bomba
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
    e.style.background = src.backgroundCampoAberto
    camposOcultos--

    if(e.style.content == src.imgBandeira) {
        e.style.content = ''
        elemento.lableBandeiras.textContent++
    }

    if(matriz[l][c] != 0) {
        mostarNumero(e, matriz[l][c])
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

function jogoPerdido(localBombas){

    boolJogando = false
    elemento.resultadoJogo[0].textContent = src.txtPerdeu
    elemento.areaCampoMinado.style.animation = src.shakeAnimation
    let i = 0

    setInterval(function(){
        if(i < localBombas.length) {

            //Interromper 
            document.querySelectorAll('#areaCampo > div > div').forEach((element) => {
                element.onclick = (e) => {
                    
                    while(i < localBombas.length-1) mostrarBomba(localBombas[i++])
                }
            })
            
            mostrarBomba(localBombas[i++])

            if(i == localBombas.length){
                setVisibilidadeTela(elemento.resultadoJogo, "flex")
                elemento.container.style.filter = src.escurecer
            }
        }

    }, 120-(localBombas.length));
}

function verificarVitoria(){
    if(camposOcultos == elemento.inputMinas.value && elemento.lableBandeiras.textContent == 0){
        boolJogando = false

        elemento.resultadoJogo[0].textContent = src.txtGanhou
        setVisibilidadeTela(elemento.resultadoJogo, "flex")
        elemento.container.style.filter = src.escurecer
    }
}

function mostrarBomba([x, y]){
    let e = document.querySelector('div[data-linha="' + (x) + '"][data-coluna="' + (y) + '"]');
    e.textContent = src.bomba
}

function reiniciarJogo(){

    for(lable of elemento.lableTempo) lable.textContent = 0
    elemento.areaCampoMinado.style.animation = "none"
    elemento.container.style.filter = "none"
    boolTempoMaximo = false

    setVisibilidadeTela(elemento.tela2, "none")
    setVisibilidadeTela(elemento.tela1, "flex")
    setVisibilidadeTela(elemento.resultadoJogo, "none")
}