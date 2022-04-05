const urlApi = API_URL;
const table = document.querySelector("#tabela-breakfast");
const initialTable = document.querySelector("#cabecalho");
const formulario = document.querySelector("#formulario");
console.log(urlApi)
const breakfastRouteUrl = (route = "") => `${urlApi}${route}`;

document.querySelector('#cpf').addEventListener('input', function (e) {
  const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
  e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '-' + x[4] + (x[5] ? '-' + x[5] : '');
});

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const fetchBreakfast = async() => {
  const response = await fetch(breakfastRouteUrl());
  const breakfastList = await response.json();
 
  breakfastList.forEach((breakfast, index) => { 
    
    table.innerHTML +=  `
      <tr class="listBreakfast" id="listBreakfast-${index}">
      <td id="nome">
          <input class="input-att" id="input-nome-${breakfast.id}" value=${breakfast.nome}>
          </td>
          <td id="cpf">
        <input class="input-att" id="input-cpf-${breakfast.id}" value=${breakfast.cpf}>
        </td>
        <td id="mesa">
        <input class="input-att" id="input-mesa-${breakfast.id}" value=${breakfast.mesa}>
        </td>
        <td>
        <img src="./img/trash-can.png" id="${index}" onclick="deletar(${breakfast.id})" title="Excluir">
          <img src="./img/system-update.png" id="${index}" onclick="atualizar(${breakfast.id})" title="Atualizar"> 
          </td>
          </tr>`
  });
}

const renderizaForm = () => {
  formulario.innerHTML = `
    <input type="text" class="marge" id="nome" placeholder="Nome">
    <input type="number" class="marge" id="cpf" placeholder="CPF">
    <input type="text" class="marge" id="mesa" placeholder="Mesa café da manha">
    <button type="button" class="marge" id="cad-button" value="Cadastrar" onclick="criar()">Cadastrar</button>`;
};

const criar = async () => {
  const infos = {
    nome: document.querySelector("#nome").value,
    cpf: document.querySelector("#cpf").value,
    mesa: document.querySelector("#mesa").value
  };

  if(infos.cpf.length < 11){
    alert("CPF deve conter 11 digitos, ex: 12345678900")
    return false;
  };

  const response = await fetch(breakfastRouteUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify(infos)
  });

  if(response.status != 200){ 
    alert("Erro ao criar.");
  };

  const content = await response.json();
  renderizaForm();
  reRenderizar();
};

const deletar = async (id) => {
  await fetch(breakfastRouteUrl(), {
    method: 'DELETE',
    headers,
    body: JSON.stringify({
      id
    })
  })
  .then(resposta => {
    if(resposta.status === 200) {
      reRenderizar();
    }
  });
};

const atualizar = async (id) => {
  const infos = {
    id,
    nome: document.querySelector(`#input-nome-${id}`).value,
    cpf: document.querySelector(`#input-cpf-${id}`).value,
    mesa: document.querySelector(`#input-mesa-${id}`).value
  };

  if(infos.cpf.length < 11 || infos.cpf.length > 11){
    alert("CPF deve conter 11 digitos, ex: 12345678900");
    return false ;
  }; 

  const response = await fetch(breakfastRouteUrl(), {
    method: 'PUT',
    headers,
    body: JSON.stringify(infos)
  });
  
  if(response.status != 200){
    alert("Erro ao alterar.");
  };

  const content = await response.json();
  reRenderizar();
}; 

const reRenderizar = async() => {
  table.innerHTML = initialTable.innerHTML;
  await fetchBreakfast();
};

(() => {
  fetchBreakfast();
})();
