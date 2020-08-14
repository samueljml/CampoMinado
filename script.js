var qtd_minas = document.getElementById("minas")
var largula = document.getElementById("largura")
var altura = document.getElementById("altura")

document.querySelectorAll(".container p input").forEach((element) => {
    element.onchange = (e) => {
        if(e.target.value < 1) e.target.value = 1;
        else if(e.target.value > 10) e.target.value = 10;
        
        if(qtd_minas.value > altura.value * largura.value){
            qtd_minas.value = (altura.value * largura.value) - 1
        }
    }
});

qtd_minas.onchange= (e) => {   
    let l = largura.value
    let a = altura.value

    if(e.target.value >= l*a) e.target.value = (l*a) -1;
    else if(e.target.value < 1)  e.target.value = 1;
}