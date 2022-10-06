const table_cuadruplos = document.getElementById("table-cuadruplos");

function calcCuadruplos() {
    //((x-1)+2)*2
    table_cuadruplos.innerHTML = '<tr><th>Operador</th><th>Arg1</th><th>Arg2</th><th>Resultado</th></tr>';
    const expresion = String(document.getElementById("expresion").value);
    
    expresion.replace(/[.*+\-?^${}()|[\]\\]/gm, '\\$&');
    let expreg = /([\d.]+)|[-+*/()=]|[a-z]/gm;
    let operaciones = expresion.match(expreg);
    let contp = 0;
    for (let i = 0; i < operaciones.length; i++) {
        if (operaciones[i] == '(') {
            contp++;
        }
    }

    let contA = -1;
    let contC = 0;
    let apertura = new Array(contp);
    let cerradura = new Array(contp);
    console.log(operaciones);
    for (let i = 0; i < operaciones.length; i++) {
        if (operaciones[i] == '(') {
            contA++;
            contC=contA;
            apertura[contA] = i;

        }
        else if (operaciones[i] == ')') {
            cerradura[contC] = i;            
            while(cerradura[contC] != undefined && contC != 0){
                contC--;
            }

        }
    }




    console.log(apertura);
    console.log(cerradura);
    let evaluados = [];
    jerarquia(apertura, cerradura, 0, operaciones.length, operaciones, evaluados, 0, 0);
}

function jerarquia(arrayA, arrayC, inicio, fin, expresion, evaluados, cont_cuadruplos, i_inicio) {
    //x=((x-1)+2)*(((2+y)+x)-3)
    let i = i_inicio;
    let it = cont_cuadruplos;
    while (i < arrayA.length) {

        if (inicio <= arrayA[i] && arrayC[i] < fin) {
            let aux = jerarquia(arrayA, arrayC, arrayA[i], arrayC[i], expresion, evaluados, it, i);
            it = aux[0];
            i = aux[1];
            i_inicio = aux[1];
        }
        i++;
    }
    debugger;
    for (let i = inicio; i < fin; i++) {
        if (expresion[i] == '/' || expresion[i] == '*') {
            let noEvaluado = true;
            for (let x = 0; x < evaluados.length; x++) {
                if (evaluados[x][0] < i && i < evaluados[x][1]) {
                    noEvaluado = false;
                }
            }
            if (noEvaluado) {
                let arg1 = expresion[i - 1];
                let arg2 = expresion[i + 1];
                let i_arg1 = i - 1;
                let i_arg2 = i + 1;
                for (let index = evaluados.length-1; index >= 0 ; index--) {
                    if (i_arg1 == evaluados[index][1]) {
                        i_arg1 = evaluados[index][0];
                        arg1 = `T${evaluados[index][2]}`;
                    }
                    if (i_arg2 == evaluados[index][0]) {
                        i_arg2 = evaluados[index][1];
                        arg2 = `T${evaluados[index][2]}`;
                    }
                }
                table_cuadruplos.insertRow(-1).innerHTML = `<td>${expresion[i]}</td><td>${arg1}</td><td>${arg2}</td><td>T${it}</td>`;
                evaluados.push([i_arg1, i_arg2, it]);
                it++;
            }
        }
    }
    for (let i = inicio; i < fin; i++) {
        if (expresion[i] == '+' || expresion[i] == '-') {
            let noEvaluado = true;
            for (let x = 0; x < evaluados.length; x++) {
                if (evaluados[x][0] < i && i < evaluados[x][1]) {
                    noEvaluado = false;
                }
            }
            if (noEvaluado) {
                debugger;
                let arg1 = expresion[i - 1];
                let arg2 = expresion[i + 1];
                let i_arg1 = i - 1;
                let i_arg2 = i + 1;
                for (let index = evaluados.length-1; index >= 0 ; index--) {
                    if (i_arg1 == evaluados[index][1]) {
                        i_arg1 = evaluados[index][0];
                        arg1 = `T${evaluados[index][2]}`;
                    }
                    if (i_arg2 == evaluados[index][0]) {
                        i_arg2 = evaluados[index][1];
                        arg2 = `T${evaluados[index][2]}`;
                    }
                }
                table_cuadruplos.insertRow(-1).innerHTML = `<td>${expresion[i]}</td><td>${arg1}</td><td>${arg2}</td><td>T${it}</td>`;
                evaluados.push([i_arg1, i_arg2, it]);
                it++;
            }
        }
    }
    debugger;
    for (let i = inicio; i < fin; i++) {
        if (expresion[i] == '=') {
            table_cuadruplos.insertRow(-1).innerHTML = `<td>${expresion[i]}</td><td>T${it-1}</td><td></td><td>${expresion[i-1]}</td>`;
            evaluados.push([i-1, i+1, it]);
            it++;

        }
    }
    
    evaluados.push([inicio, fin, it-1])
    return [it, i_inicio];
}
