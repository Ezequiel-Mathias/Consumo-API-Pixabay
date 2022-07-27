'use strict'

//Função responsavel pelo enter
const handlekeypress  = ({key , target}) => {
    if ( key === 'Enter'){
        CarregarImagens(target.value)
    }

}

//Função responsavel pelo enter, para toda vez que o usuario trocar de pagina e der enter trocar a pagina
const handlePage = ({key , target }) => {
    const text = document.querySelector('#search-input').value 
    if ( key === 'Enter'){
        CarregarImagens(text , target.value)
    }
}

//Função responsavel por fazer o carregamento das imagens
const CarregarImagens = async (texto , page = 1) => {
const container = document.querySelector('.container-gallery');
// uso tbm o formato de desconstução acessando os hits, essa forma de desconstrução serve para acessar inumeras coisas poupando tempo e com mais agilidade (PESQUISAR SOBRE !)

//alem disso da para desconstruir e pegar varias funções em uma constante só, como no caso abaixo eu pego os hits e o total de hits
const {hits , totalHits} = await ProcurarImagens(`${texto}&page=${page}`)
//Nessa parte eu uso o map para percorrer o array da api um a um e mandar para a função CriarCards que fara a criação desses cards em html
const cards = hits.map(CriarCards)
//Aqui eu uso o replaceChildren para inserir todos os filhos que no caso são divs que vem do CriarCards, so que essa função replaceChildren recebe objetos e não array, então eu coloco os 3 pontinhos antes para espalhar o array e ele conseguir fazer o trabalho dele.
container.replaceChildren(...cards)
//isso serve para quando eu fazer a pesquisa clicando nas tegs o valor da barra de pesquisa muda tbm
document.querySelector('#search-input').value = texto
//Faço a mesma coisa com as paginas, jogo o numemo da pagina lá na input pra trocar o valor
document.querySelector('#page').value = page
//Uso o textContent para colocar um valor, pois ao contrario dos demais nessa caso é uma span, ele vai servir para colocar o numero total de paginas.
//A classe Math.ceil retorna o ultimo numero inteiro, eu divido por 20 para fazer os calculos necessarios para obter o numero de paginas
const totalDePaginas = Math.ceil(totalHits/20)  
document.querySelector('#page-total').textContent = `/ ${totalDePaginas}`

}

//Função Responsavel Por trazer informações da API
const ProcurarImagens = async (texto) => {
     const ChaveApi = '28844701-cfe5baccd37f21cad8a0b8402'
     const url = `https://pixabay.com/api/?key=${ChaveApi}&q=${texto}`
     const resposta = await fetch(url)
     return resposta.json()
}

//Função responsavel por colocar o link e fazer a pesquisa assim que for clicado com a função onClick
const createLink = (tag) => `
    <a href="#" onClick="CarregarImagens('${tag}')">
        ${tag}
    </a>
`


//Função responsavel pela criação dos cards em html
//Aqui eu tbm uso desconstrução para acessar o webformatURL dessa api que no caso está dentro de hits
const CriarCards = ({webformatURL , pageURL , tags , likes , comments , collections}) => {
    const card = document.createElement('div')
    card.classList.add('card-container');
    card.innerHTML = `
    <a href="${pageURL}" class="card-image">
    <img src=${webformatURL} >
    </a>
<div class="card-info">
    <div class="card-tags">
      ${tags.split(',').map(createLink).join('')}
    </div>
    <div class="card-action">  
        <div class="card-like">
            <i class="far fa-thumbs-up"></i>
            <span>${likes}</span>
        </div>
        <div class="card-comment">
            <i class="far fa-comment"></i>
            <span>${comments}</span>
        </div>
        <div class="card-save">
            <i class="far fa-bookmark"></i>
            <span>${collections}</span>
        </div>
    </div>

</div>
`
    return card
}

//Função responsavel por fazer a paginição com o click la da setinha, ir pra frente. 
const handleNext = () => {
//Nesse caso eu uso let pois a variavel ira mudar, const é para valores que não vão mudar.Logo em seguida eu trasformo o valor para numero usando a função number! e assim ja tenho o numero da pagina atual
    let page = Number(document.querySelector('#page').value)
    //pegando o numero total de paginas e retirando a / que eu coloquei anteriormente com o replace da seguinte forma:
    const totalDePaginas = Number(document.querySelector('#page-total').textContent.replace('/' , ''))
    const texto = document.querySelector('#search-input').value

    console.log(page, totalDePaginas)
    //validação
    if( page < totalDePaginas){
        page++;
        CarregarImagens(texto , page)
    }else{
         
    }
}

//Função responsavel por voltar a pagina anterior
const handlePrevious = () => {
    //Nesse caso eu uso let pois a variavel ira mudar, const é para valores que não vão mudar.Logo em seguida eu trasformo o valor para numero usando a função number! e assim ja tenho o numero da pagina atual
    let page = Number(document.querySelector('#page').value)
    //pegando o numero total de paginas e retirando a / que eu coloquei anteriormente com o replace da seguinte forma:
    const totalDePaginas = Number(document.querySelector('#page-total').textContent.replace('/' , ''))
    const texto = document.querySelector('#search-input').value
    //validação
    if( page > 1){
        page--;
        CarregarImagens(texto , page)
    }else{
         
    }
}

 
// Parte dos eventos
document.querySelector('#search-input').addEventListener('keypress' , handlekeypress)
document.querySelector('#page').addEventListener('keypress', handlePage)
document.querySelector('#page-next').addEventListener('click' , handleNext)
document.querySelector('#page-previous').addEventListener('click' , handlePrevious)