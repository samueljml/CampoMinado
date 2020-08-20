let boolJogando = false
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
    lableBandeiras: document.getElementById("labelQtdBandeiras"),
    resultadoJogo: document.querySelectorAll("#statusJogo>#resultadoJogo")
}

let src = {
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

//Atualiza tempo de jogo
let tempoMaximo = false
setInterval(function(){
    if(boolJogando){
        
        if(!tempoMaximo){
        
            if(++elemento.lableTempo[2].textContent == 10){
                elemento.lableTempo[2].textContent = 0
    
                if(++elemento.lableTempo[1].textContent == 10) {
                    elemento.lableTempo[1].textContent = 0
                    elemento.lableTempo[0].textContent++
                }
            }
            if(elemento.lableTempo[2].textContent == 9 && elemento.lableTempo[1].textContent == 9 && elemento.lableTempo[0].textContent == 9) tempoMaximo = true
        }
    } 
}, 1000);

function iniciarJogo(){

    setVisibilidadeTela(elemento.tela1, "none")
    setVisibilidadeTela(elemento.tela2, "flex")

    boolJogando = true
    elemento.lableBandeiras.textContent = elemento.inputMinas.value
    camposOcultos = elemento.inputColunas.value * elemento.inputLinhas.value

    let matriz = []

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

            if(!boolJogando || e.target.style.content == src.imgBandeira) return

            var l = parseInt(e.target.dataset.linha)
            var c = parseInt(e.target.dataset.coluna)

            if(!e.target.textContent){
                if(matriz[l][c] == "*"){
                    e.target.textContent = matriz[l][c]
                    e.target.style.background = src.backgroundBomba
                    jogoPerdido(localBombas)
                }
                else if(matriz[l][c] == 0){
                    AbrirEspaçosVazios(matriz, l, c)
                }
                else{
                    e.target.textContent = matriz[l][c]
                    e.target.style.background = src.backgroundCampoAberto
                    e.target.style.color = coloraçãoNumeros[parseInt(e.target.textContent)-1]
                    matriz[l][c] = undefined
                    camposOcultos--

                    verificarVitoria()
                }
            }
        }
        element.oncontextmenu = (e) => {

            if(!boolJogando) return

            e.preventDefault();
            if(!e.target.textContent && e.target.style.background != src.backgroundCampoAberto){
                if(e.target.style.content == ''){
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
        }
    })
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

        if(matriz[x][y] != '*'){
            matriz[x][y]='*'
            localBombas[localBombas.length] = [x, y]
            incrementarValores(matriz, x, y)
            qtdBombas--
        }
    }
    return localBombas
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
    e.style.background = src.backgroundCampoAberto
    camposOcultos--

    if(e.style.content == src.imgBandeira) {
        e.style.content = ''
        elemento.lableBandeiras.textContent++
    }

    if(matriz[l][c] != 0) {
        e.textContent = matriz[l][c]
        e.style.color = coloraçãoNumeros[parseInt(matriz[l][c])-1] 
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
    elemento.resultadoJogo[0].textContent = "Você Perdeu"
    elemento.areaCampoMinado.style = "animation: shake 0.4s"
    let i = 0

    setInterval(function(){
        if(i < localBombas.length) {

            //Interromper 
            document.querySelectorAll('#areaCampo > div > div').forEach((element) => {
                element.onclick = (e) => {
                    for(; i < localBombas.length-1; i++){
                        
                        let [x, y] = localBombas[i]
                        mostrarBomba(x, y)
                    }
                }
            })
            
            let [x, y] = localBombas[i++]
            mostrarBomba(x, y)
        }
        else if (i++ == localBombas.length) setVisibilidadeTela(elemento.resultadoJogo, "flex")

    }, 120-(localBombas.length));
}

function verificarVitoria(){
    if(camposOcultos == elemento.inputMinas.value && elemento.lableBandeiras.textContent == 0){
        boolJogando = false

        elemento.resultadoJogo[0].textContent = "Você Ganhou"
        setVisibilidadeTela(elemento.resultadoJogo, "flex")
    }
}

function mostrarBomba(x, y){
    let e = document.querySelector('div[data-linha="' + (x) + '"][data-coluna="' + (y) + '"]');
    e.textContent = "*"
}

function reiniciarJogo(){

    for(lable of elemento.lableTempo) lable.textContent = 0
    elemento.areaCampoMinado.style = "animation: none"
    tempoMaximo = false

    setVisibilidadeTela(elemento.tela2, "none")
    setVisibilidadeTela(elemento.tela1, "flex")
    setVisibilidadeTela(elemento.resultadoJogo, "none")
}