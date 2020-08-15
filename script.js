var qtd_minas = document.getElementById("minas")
var linhas = document.getElementById("largura")
var colunas = document.getElementById("altura")

document.querySelectorAll(".container p input").forEach((element) => {
    element.onchange = (e) => {
        if(e.target.value < 1) e.target.value = 1;
        else if(e.target.value > 10) e.target.value = 10;
        
        if(qtd_minas.value > linhas.value * colunas.value){
            qtd_minas.value = (linhas.value * colunas.value) - 1
        }
    }
});

qtd_minas.onchange= (e) => {   
    let l = linhas.value
    let a = colunas.value

    if(e.target.value >= l*a) e.target.value = (l*a) -1;
    else if(e.target.value < 1)  e.target.value = 1;
}

function iniciarJogo(){
    elementos_tela1 = document.getElementsByClassName("tela1")

    for(i=0; i<elementos_tela1.length; i++){
        elementos_tela1[i].style.display = 'none'
    }

    let matriz = []

    for(l=0; l<linhas.value; l++){
        matriz[l] = []
        for(c=0; c<colunas.value; c++){
            matriz[l][c] = 0
        }
    }

    inserirMinas(matriz, linhas.value, colunas.value, parseInt(qtd_minas.value))
    
    campo = document.getElementsByClassName("container")[0]

    campo.innerHTML = criarTabela(matriz)

    document.querySelectorAll('.container > div > div').forEach((element) => {
        element.onclick = (e) => {
            var l = e.target.dataset.linha;
            var c = e.target.dataset.coluna;

            if(matriz[l][c] == "*"){
                e.target.textContent = matriz[l][c]
                element.style.background = 'rgb(177, 59, 49)'
            }
            else{
                e.target.textContent = matriz[l][c]
                element.style.background = 'rgb(103, 139, 131)'
            }
        }
    })
}

function inserirMinas(matriz, linhas, colunas, qtd_minas){

    while(qtd_minas > 0){
        let x = Math.round(Math.random() * (linhas-1))
        let y = Math.round(Math.random() * (colunas-1))

        if(matriz[x][y] != '*'){
            matriz[x][y]='*'
            incrementarValores(matriz, x, y)
            qtd_minas--
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

function criarTabela(matriz){
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