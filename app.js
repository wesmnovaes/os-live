
angular.module("oslive", ['ngAnimate'])

.controller('homeController', function($scope){

var carga = 1000;
var cont = 100
 $scope.mfisicaocupada = 0;
var aleatorio = false;
var remove = false;
var pc, cpu, pagina, time, corProcesso;

//Definindo processos 
$scope.nomeProcesso = ["A","B","C","D"];
$scope.processos = [];
$scope.processoA = [
				//	{nome: "A0", pagina: 0, cor: "#3253C3", bit: "i", $$hashKey: "object:33"}, 
				//	{nome: "A1", pagina: 1, cor: "#3253C3", bit: "i", $$hashKey: "object:34"},
				//	{nome: "A2", pagina: 2, cor: "#3253C3", bit: "i", $$hashKey: "object:35"},
				//	{nome: "A3", pagina: 3, cor: "#3253C3", bit: "i", $$hashKey: "object:36"},
				];
$scope.processoB = [];
$scope.processoC = [];
$scope.processoD = [];
$scope.processoAtual = null;

//Definindo Memória física para ser alocada
$scope.memoriaF = [
	{paginaf: 0, cor: "#7FB174", nome: null, horaCarga: null},
	{paginaf: 1, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 2, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 3, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 4, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 5, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 6, cor: "#7FB174", nome: null, horaCarga: null}, 
	{paginaf: 7, cor: "#7FB174", nome: null, horaCarga: null},
];

//info é o valor da primeira posição do select "Selecione o Algoritmo de escalonamento"
$scope.escalonador = "FIFO"
$scope.listaFIFO=[];

//////////////////////////CADASTAR PROCESSO E CRIAR MEMÓRIA LÓGICA E TABELA DE PÁGINAS////////////////
$scope.cadastrar = function(processo){
	if(!verificaID(processo.nome) && !!processo.nome ){
		$scope.criaPaginas(processo)
		if(processo.pagina != null){
			var p = angular.copy(processo);
			p.cor = corProcesso;
			$scope.processos.push(p);
			$scope.limparForm(processo.nome);
			$(".glyphicon-cog").notify("Processo cadastrado!", "success");	
		}
		else{
			$(".glyphicon-cog").notify("Processo sem Páginas", "error");
		}
	} else{
		$(".glyphicon-cog").notify("Preencha todos os campos!", "info");
	}
}


$scope.criaPaginas = function(processo){
	var paginasize = processo.pagina;

	for (var i = 0; i < paginasize; i ++) {
		var pag = angular.copy(processo);
		pag.nome = processo.nome+i;
		pag.status = false;
		pag.pagina =i;
		pag.bit = "I";
		pag.endMF = null;
		if(processo.nome == "A"){

			corProcesso="#0780A7";
			pag.cor = "#0780A7";
			pag.cort = "#0780a769";
			pag.bitcor = "#000"
			$scope.processoA.push(pag);
			if(i < 2){
				$scope.carregarPagina($scope.processoA[i])
			}
		} if(processo.nome == "B"){
			corProcesso="#785964"
			pag.cor = "#785964"
			pag.cort = "#78596469";
			pag.bitcor = "#000"
			$scope.processoB.push(pag);
			if(i < 2){
				$scope.carregarPagina($scope.processoB[i])
			}
		} if(processo.nome == "C"){
			corProcesso="#bf565c"
			pag.cor = "#bf565c"
			pag.cort = "#bf565c69";
			pag.bitcor = "#000"
			$scope.processoC.push(pag);
			if(i < 2){
				$scope.carregarPagina($scope.processoC[i])
			}
		} if(processo.nome == "D"){
			corProcesso="#4B706A"
			pag.cor = "#4B706A"
			pag.cort = "#4b706a66";
			pag.bitcor = "#000"
			$scope.processoD.push(pag);
			if(i < 2){
				$scope.carregarPagina($scope.processoD[i])
			}
		}
	}

	
}

$scope.paginaStatus= function(pagina){
	if(pagina.status){
		$scope.removePagina(pagina)
	}else{
		$scope.carregarPagina(pagina)
	}
}

$scope.carregarPagina = function(processo){
	
	if(!verificaPagina(processo.nome)){
		for (var i = 0; i < $scope.memoriaF.length; i ++) {
			if($scope.memoriaF[i].nome != null){
				console.log("i = ",i," Carga da MF",$scope.memoriaF[i].horaCarga, "< var Carga ", carga )
				if($scope.memoriaF[i].horaCarga < carga){
					carga = $scope.memoriaF[i].horaCarga;
					pagina =  i;
					console.log("compara carga - Carga atual: ", carga, "página da carga", pagina)
					
				}else if(i == 7){
					console.log("Memória F anes da troca:",$scope.memoriaF)

					$(".alertafifo").notify("Menor time stamp: "+$scope.listaFIFO[$scope.listaFIFO.length -1].horaCarga+"\n Página "+$scope.listaFIFO[$scope.listaFIFO.length -1].nome+" retirada da memória",{position:"top center",autoHideDelay: 7000} );
					$(".alertamf").notify("Substituição FIFO:\n Remove "+ $scope.listaFIFO[$scope.listaFIFO.length -1].nome +" -> Carrega: "+processo.nome, {className: 'success',position:"bottom center",autoHideDelay: 10000});
					
					//$(".alerta").notify("Remove página: "+ $scope.listaFIFO[$scope.listaFIFO.length -1].nome +"\n Carrega página: "+processo.nome, "info");
					var pag = $scope.listaFIFO[$scope.listaFIFO.length -1].nome;
					console.log("Troca pagina", pagina, " pag", pag, "Lista FFIFO",$scope.listaFIFO )
					
					$scope.listaFIFO.pop();
					$scope.memoriaF[pagina].nome = processo.nome;
					$scope.memoriaF[pagina].cor = processo.cor;
					$scope.memoriaF[pagina].horaCarga = cont;
					$scope.memoriaF[pagina].processoL.bit = "I";
					$scope.memoriaF[pagina].processoL.status = false;
					$scope.memoriaF[pagina].processoL.endMF = null;
					$scope.memoriaF[pagina].processoL.bitcor = "#000";
					if(pag.indexOf("A") != -1){
						$scope.memoriaF[pagina].processoL.cort = "#0780a769";
					}else if(pag.indexOf("B") != -1){
						$scope.memoriaF[pagina].processoL.cort = "#78596469";
					}else if(pag.indexOf("C") != -1){
						$scope.memoriaF[pagina].processoL.cort = "#bf565c69";
					}else{
						$scope.memoriaF[pagina].processoL.cort = "#4b706a66";
						
					}
					$scope.listaFIFO.unshift($scope.memoriaF[pagina])


					processo.cort = processo.cor;
					processo.status = true;
					processo.bitcor = "#FFFFFF"
					processo.bit = "V";
					processo.endMF = $scope.memoriaF[pagina].paginaf;
					$scope.memoriaF[pagina].processoL = processo;
					cont ++;
					carga = 1000;
					
				}
				
			} else if ($scope.memoriaF[i].nome == null) {
				
				$scope.memoriaF[i].nome = processo.nome;
				$scope.memoriaF[i].cor = processo.cor;
				$scope.memoriaF[i].horaCarga = cont;
				$scope.memoriaF[i].processoL = processo;
				$scope.listaFIFO.unshift($scope.memoriaF[i])
				processo.cort = processo.cor;
				processo.status = true;
				processo.bitcor = "#FFFFFF"
				processo.bit = "V";
				processo.endMF = $scope.memoriaF[i].paginaf;
				cont ++;
				$(".glyphicon-cog").notify("Página "+ processo.nome +" carregada na memória física!" , "success");
				$scope.mfisicaocupada++;
				if($scope.mfisicaocupada ==8){
					$(".alerta").notify("Memória física cheia!",{position:"top center",type:"warn"});
				}
				break;
			}
		}
	} else{
		$(".glyphicon-cog").notify("Página "+ processo.nome +" Já está na memória!", "error");
	}
}

$scope.removePagina = function(pagina){

	
	var indice = pagina.endMF;
	pag = pagina.nome;
	var indiceFIFO = $scope.listaFIFO.indexOf($scope.memoriaF[indice]);

	$scope.memoriaF[indice].processoL.bit = "I";
	$scope.memoriaF[indice].processoL.status = false;
	$scope.memoriaF[indice].processoL.endMF = null;
	$scope.memoriaF[indice].processoL.bitcor = "#000";

	if(pag.indexOf("A") != -1){
		$scope.memoriaF[indice].processoL.cort = "#0780a769";
	}else if(pag.indexOf("B") != -1){
		$scope.memoriaF[indice].processoL.cort = "#78596469";
	}else if(pag.indexOf("C") != -1){
		$scope.memoriaF[indice].processoL.cort = "#bf565c69";
	}else{
		$scope.memoriaF[indice].processoL.cort = "#4b706a66";
	}

	$scope.memoriaF[indice].nome = null;
	$scope.memoriaF[indice].cor = "#7FB174";
	$scope.memoriaF[indice].horaCarga = null;
	$scope.memoriaF[indice].processoL = [];
	$scope.listaFIFO.splice(indiceFIFO,1);
	$(".glyphicon-cog").notify("Página "+ pag +" removida da memória física!" , "success");

$scope.mfisicaocupada--;
}

$scope.excluir = function(processo,index){
	console.log(processo,index)
	var qtd = processo.pagina;
	var procnome = processo.nome.substring(0,1);

	if( processo.nome =="A"){
		for(i = 0; i < qtd; i++){
			if($scope.processoA[0].status){
				var indice= $scope.processoA[0].endMF;
				var indiceFIFO = $scope.listaFIFO.indexOf($scope.memoriaF[indice]);
				console.log("indice fifo",$scope.listaFIFO.indexOf($scope.memoriaF[indice]))
				console.log(indice)
				$scope.memoriaF[indice].nome = null;
				$scope.memoriaF[indice].cor = "#7FB174";
				$scope.memoriaF[indice].horaCarga = null;
				$scope.memoriaF[indice].processoL = [];
				$scope.listaFIFO.splice(indiceFIFO,1);
				$scope.mfisicaocupada--;
			}
			$scope.processoA.splice(0,1);
		}
	}
	if( processo.nome =="B"){
		for(i = 0; i < qtd; i++){
			if($scope.processoB[0].status){
				var indice= $scope.processoB[0].endMF;
				var indiceFIFO = $scope.listaFIFO.indexOf($scope.memoriaF[indice]);
				$scope.memoriaF[indice].nome = null;
				$scope.memoriaF[indice].cor = "#7FB174";
				$scope.memoriaF[indice].horaCarga = null;
				$scope.memoriaF[indice].processoL = [];
				$scope.listaFIFO.splice(indiceFIFO,1);
				$scope.mfisicaocupada--;
			}
			$scope.processoB.splice(0,1);
		}
	}
	if( processo.nome =="C"){
		for(i = 0; i < qtd; i++){
			if($scope.processoC[0].status){
				var indice= $scope.processoC[0].endMF;
				var indiceFIFO = $scope.listaFIFO.indexOf($scope.memoriaF[indice]);
				$scope.memoriaF[indice].nome = null;
				$scope.memoriaF[indice].cor = "#7FB174";
				$scope.memoriaF[indice].horaCarga = null;
				$scope.memoriaF[indice].processoL = [];
				$scope.listaFIFO.splice(indiceFIFO,1);
				$scope.mfisicaocupada--;
			}
			$scope.processoC.splice(0,1);
		}
	}
	if( processo.nome =="D"){
		for(i = 0; i < qtd; i++){
			if($scope.processoD[0].status){
				var indice= $scope.processoD[0].endMF;
				var indiceFIFO = $scope.listaFIFO.indexOf($scope.memoriaF[indice]);
				$scope.memoriaF[indice].nome = null;
				$scope.memoriaF[indice].cor = "#7FB174";
				$scope.memoriaF[indice].horaCarga = null;
				$scope.memoriaF[indice].processoL = [];
				$scope.listaFIFO.splice(indiceFIFO,1);
				$scope.mfisicaocupada--;
			}
			$scope.processoD.splice(0,1);
		}
	}

	$scope.processos.splice(index, 1);
	$scope.nomeProcesso.push(procnome);
	$scope.nomeProcesso.sort();

	carga = $scope.trocaCarga(cont)

}

	
	
$scope.trocaCarga = function(tstamp){
	console.log("chegada time stamp:",tstamp );
	
	for(i =0; i< $scope.memoriaF.length; i++){
		if($scope.memoriaF[i].horaCarga < tstamp){
			console.log($scope.memoriaF[i].horaCarga)
			tstamp = $scope.memoriaF[i].horaCarga;
		}
	}
	console.log("Menor time stamp:",tstamp );
	if(tstamp == null){
		return 1000;
	}else{
		return tstamp;
	}
}

/////////////////////////////////////////

/* $scope.cadastrar = function(processo){
	processo.nome = processo.nome.toUpperCase();
	if(!verificaID($scope.processo.nome)){
		if($scope.processo.pagina != null){
			console.log($scope.processo);
			var p = angular.copy(processo);
			p.cor = gera_cor();
			$scope.processos.push(p);
			$scope.criaPaginas($scope.processos);
			$scope.limparForm();
			

			$(".glyphicon-cog").notify("Processo cadastrado!", "success");	
			
		}
		else{
			$(".glyphicon-cog").notify("Processo sem Páginas", "error");
		}
			
	} else{
		$(".glyphicon-cog").notify("Processo já existe!", "error");
	}
}
console.log('animação fila de aptos' + processo.nome); */

$scope.limparForm = function(nome){
	$scope.processo.nome="";
	$scope.processo.pagina=null;
	var indice = $scope.nomeProcesso.indexOf(nome)
	$scope.nomeProcesso.splice(indice,1)
}
$scope.cancelar = function(nome){
	$scope.processo.nome="";
	$scope.processo.pagina=null;
}

// função para exibição do tooltip
jQuery(function(){
    $('[data-toggle=tooltip]').hover(function(){
		// on mouseenter
		$(this).tooltip('show');
    }, function(){
		// on mouseleave
        $(this).tooltip('hide');
    });
});


$scope.limparListProcessos = function(){
	var processosSize = $scope.processos.length;
	for (var i = 0; i < processosSize; i ++) {
		$scope.processos.shift();
	}
}




$scope.geradorAleatorio = function(){
	
	if(!aleatorio){
		listNomes = ["A", "B", "C", "D"];
		for (var i = 0; i < 4; i++) {
			var processo = new Object();
			processo.nome = listNomes[i];
			processo.pagina = Math.round(Math.random() * 2) + 2;
			$scope.cadastrar(processo)
			aleatorio = true;
		}	
	}else{
		$(".glyphicon-cog").notify("Todos os processo já foram criados!", "info");
	
	}
}

// cria fila de aptos
$scope.aptos = function(list) {
	var aux, count = null;
	$scope.filaAptos = [];
	$scope.filaDelay = [];
	list.forEach(function(processo, i){
		if (i != 0) count ++;
		if (processo.nome != aux && processo.nome != "-") {
			aux = processo.nome;
			p = angular.copy(processo);
			p.count = count;
			$scope.filaAptos.push(p);
			$scope.filaDelay.push(count);
		}
	});
}

//animação da fila de aptos
// $scope.animacaoFilaApto = function(processo){
// 	console.log('processoAtual = ' + $scope.processoAtual);
// 	$scope.processoAtual = processo.nome;
// 	console.log('processoAtual = ' + $scope.processoAtual);
// 	for(var i=0; i< $scope.filaAptos.length; i++){
// 		if ($scope.filaAptos[i].nome == processo.nome && $scope.filaAptos[i].cor != '#e8e5e5') {
// 			$scope.filaAptos[i].cor = '#e8e5e5';
// 			break;
// 		}
// 	}
// 	console.log('animação fila de aptos' + processo.nome);
// }

$scope.cancel_simulacao = function(){
	window.location.reload();
}


//cria-se uma copia do objeto a ser editado e seta a copia no scope.processo
$scope.editar = function(processo){
	$scope.aleatorio = false;
	var copia = angular.copy(processo);
	$scope.processo = copia;
	$scope.processo.edit = true;
}

$scope.simular = function(){
var algoritmo = $scope.escalonador;
$scope.resultados;
$scope.resultados2;
$scope.mediaEspera;
$scope.mediaTurn;

	var lista = validar();
	pc = new PC (lista);
	cpu = new CPU ();

	if(algoritmo!=null && algoritmo!="info"){
		if(lista.length != 0){
			
			if(algoritmo == "FIFO"){
				$scope.resultados = simulandoFIFO();
				$scope.resultados2 = pc.tabelaResultado();
				drawChart($scope.resultados2);
				$(".alertafifo").notify("Escalonamento FIFO!", "success");
			}
		}
		else{
			$(".glyphicon-cog").notify("Adicione os Processos!", {
				position:"right" });
		}
	} 
	else{
		$(".glyphicon-cog").notify("Selecione o algoritmo!", {
			position:"right" });
	}
	$scope.aptos($scope.resultados);
}


function simulandoFIFO(){
	var escalonar = new FIFO(); 
	var resultado = []; 
	var status = new Array();
	var aux;

	time =0;  

	while(!pc.vazio() || !escalonar.vazio() || cpu.ocupado){   
		aux = pc.processosPorTempo(time);
		
		while(aux.length >0){
			escalonar.addProcesso(aux.shift()); 
		}

		if(!cpu.ocupado && !escalonar.vazio()){  
			cpu.alocaProcesso(escalonar.escolherProcesso());
		}

		if(cpu.ocupado){ 
			aux = cpu.act();
			if(!cpu.ocupado)  
				pc.addfinalizado(aux); 
		}
		else
			aux = null;

		escalonar.addTEspera(1);  

		if(aux != null) 
			resultado.push({nome:aux.nome, cor: aux.cor});
		else 
			resultado.push({nome:"-", cor: "#FFFFFF"}); 

		time++;
	}

	for(var i=0; i< resultado.length; i++){
		status.push({tempo:i, nome:resultado[i].nome, cor: resultado[i].cor});
	}
	return status;
}


function validar(){		//verifica se o primeiro processo inicializa com zero
	var pro = new Array();

	for(var i=0; i< $scope.processos.length; i++){
		if($scope.processos[0].pagina != 0 ){
			var cor = gera_cor();
			pro.push(new Processo($scope.processos[i].nome, $scope.processos[i].pagina, $scope.processos[i].cor));
		}
	}
	return pro;
}


function verificaID(nome){			// Verifica se o processo já existe
	for(var i=0; i< $scope.processos.length; i++){
		if($scope.processos[i].nome == nome){
			return true;
		}
	}
	return false;
}

function verificaPagina(nome){			// Verifica se a página já está na memória física
	for(var i=0; i< $scope.memoriaF.length; i++){
		if($scope.memoriaF[i].nome == nome){
			return true;
		}
	}
	return false;
}

function gera_cor(){		// gera cor aleatoria
    var hexadecimais = '0123456789ABCDEF';
    var cor = '#';
    // Pega um número aleatório no array acima
    for (var i = 0; i < 6; i++ ) {
    //E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
}

});
