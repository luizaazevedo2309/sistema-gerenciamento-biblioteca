document.addEventListener('DOMContentLoaded', () => { 

  const API = 'http://localhost:3000';

  const qs = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);
  let cpfLogado = null;

  function show(id) {
    qsa('.secao').forEach(s => s.classList.remove('active'));
    qs(id)?.classList.add('active');
  }

  function toggle(id) {
    qsa('.area-func').forEach(e => e.classList.add('hidden'));
    qs(id)?.classList.remove('hidden');
  }

  async function api(url, method = 'GET', body) {
  const options = {
    method,
    headers: {}
  };

  if (body && method !== 'GET') {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API + url, options);

  if (!res.ok) throw await res.text();
  return res.json().catch(() => null);
}


  function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString('pt-BR');
}


  /* ===== NAVEGAÇÃO ===== */
  qs('#btn-open-login').onclick = () => show('#page-login');
  qs('#btn-open-register').onclick = () => show('#page-register');
  qs('#btn-login-cancel').onclick = () => show('#page-home');
  qs('#btn-register-cancel').onclick = () => show('#page-home');
  qs('#btn-logout-client').onclick = () => show('#page-home');
  qs('#btn-logout-emp').onclick = () => show('#page-home');

  /* ===== LOGIN ===== */
  qs('#btn-login').onclick = async () => {
  try {
    const cpf = qs('#login-cpf').value;
    const senha = qs('#login-senha').value;
    const r = await api('/login', 'POST', { cpf, senha });

    cpfLogado = cpf; 

    if (r.usuario.tipo === 'cliente') {
      show('#page-client');
      carregarEmprestimosCliente();
    } else show('#page-employee');

  } catch (e) { alert(e); }
};


  /* ===== CLIENTE ===== */
  qs('#btn-register').onclick = async () => {
    try {
      await api('/pessoas', 'POST', {
        cpf: qs('#reg-cpf').value,
        nome: qs('#reg-nome').value,
        email: qs('#reg-email').value,
        telefone: qs('#reg-telefone').value,
        senha: qs('#reg-pass').value
      });
      alert('Cliente cadastrado!');
      show('#page-login');
    } catch (e) { alert(e); }
  };

  /* ===== MENU FUNCIONÁRIO ===== */
  qs('#btn-emp-cad-func').onclick = () => toggle('#emp-cad-func');
  qs('#btn-emp-cad-livro').onclick = () => toggle('#emp-cad-livro');
  qs('#btn-emp-cad-categoria').onclick = () => toggle('#emp-cad-categoria');
  qs('#btn-emp-vincular').onclick = () => toggle('#emp-vincular');
  qs('#btn-emp-emprestimo').onclick = () => toggle('#emp-emprestimo');
  qs('#btn-emp-devolucao').onclick = () => toggle('#emp-devolucao');

  /* ===== FUNCIONÁRIO ===== */
  qs('#ef-save').onclick = () => api('/pessoas/funcionario', 'POST', {
    cpf: qs('#ef-cpf').value,
    nome: qs('#ef-nome').value,
    email: qs('#ef-email').value,
    telefone: qs('#ef-tel').value,
    senha: qs('#ef-pass').value
  }).then(()=>alert('Funcionário cadastrado!')).catch(alert);

  qs('#ef-update').onclick = () => api(`/pessoas/${qs('#ef-cpf').value}`, 'PUT', {
    nome: qs('#ef-nome').value,
    email: qs('#ef-email').value,
    telefone: qs('#ef-tel').value,
    senha: qs('#ef-pass').value,
    tipo: 'funcionario'
  }).then(()=>alert('Funcionário atualizado!')).catch(alert);

  qs('#ef-delete').onclick = () => api(`/pessoas/${qs('#ef-cpf').value}`, 'DELETE')
    .then(()=>alert('Funcionário excluído!')).catch(alert);

  /* ===== LIVRO ===== */
  qs('#btn-save-livro').onclick = () => api('/livros', 'POST', {
    isbn: qs('#livro-isbn').value,
    titulo: qs('#livro-titulo').value,
    disponivel: true
  }).then(()=>alert('Livro cadastrado!')).catch(alert);

  qs('#btn-update-livro').onclick = () => api(`/livros/${qs('#livro-isbn').value}`, 'PUT', {
    titulo: qs('#livro-titulo').value,
    disponivel: true
  }).then(()=>alert('Livro atualizado!')).catch(alert);

  qs('#btn-delete-livro').onclick = () => api(`/livros/${qs('#livro-isbn').value}`, 'DELETE')
    .then(()=>alert('Livro excluído!')).catch(alert);

  /* ===== CATEGORIA ===== */
  qs('#btn-save-cat').onclick = () => api('/categoria', 'POST', {
    codigo: qs('#cat-codigo').value,
    nome: qs('#cat-nome').value
  }).then(()=>alert('Categoria cadastrada!')).catch(alert);

  qs('#btn-update-cat').onclick = () => api(`/categoria/${qs('#cat-codigo').value}`, 'PUT', {
    nome: qs('#cat-nome').value
  }).then(()=>alert('Categoria atualizada!')).catch(alert);

  qs('#btn-delete-cat').onclick = () => api(`/categoria/${qs('#cat-codigo').value}`, 'DELETE')
    .then(()=>alert('Categoria excluída!')).catch(alert);

  /* ===== VÍNCULO ===== */
  qs('#btn-save-vinc').onclick = () => api('/livroCategoria', 'POST', {
    isbn: qs('#vinc-isbn').value,
    codigo: qs('#vinc-codigo').value
  }).then(()=>alert('Vínculo criado!')).catch(alert);

  qs('#btn-delete-vinc').onclick = () => api(`/livroCategoria/${qs('#vinc-isbn').value}/${qs('#vinc-codigo').value}`, 'DELETE')
    .then(()=>alert('Vínculo excluído!')).catch(alert);

  /* ===== EMPRÉSTIMO ===== */
 qs('#btn-save-loan').onclick = () => api('/emprestimos', 'POST', {
  cpf: qs('#loan-cpf').value,
  isbn: qs('#loan-isbn').value,
  data_emprestimo: new Date().toISOString().slice(0,10),
  data_devolucao: qs('#loan-data-dev').value,
  status: 'emprestado'
})


  qs('#btn-update-loan').onclick = () => api(`/emprestimos/${qs('#loan-id').value}`, 'PUT', {
  data_devolucao: qs('#loan-data-dev').value,
  cpf: qs('#loan-cpf').value,
  isbn: qs('#loan-isbn').value
  });

  qs('#btn-delete-loan').onclick = () => api(`/emprestimos/${qs('#loan-id').value}`, 'DELETE')
    .then(()=>alert('Empréstimo excluído!')).catch(alert);


  

    /* ===== LISTAR FUNCIONÁRIO ===== */
  qs('#ef-list').onclick = async () => {
    try {
      const dados = await api('/pessoas/funcionario');
      qs('#ef-list-body').innerHTML = dados.map(f => 
        `<tr><td>${f.cpf}</td><td>${f.nome}</td><td>${f.email}<td>${f.telefone}</td></tr>`
      ).join('');
    } catch (e) { alert(e); }
  };

  /* ===== LISTAR LIVRO ===== */
  qs('#btn-list-livro').onclick = async () => {
    try {
      const dados = await api('/livros');
      qs('#livro-list-body').innerHTML = dados.map(l => 
        `<tr><td>${l.isbn}</td><td>${l.titulo}</td><td>${l.disponivel}</td></tr>`
      ).join('');
    } catch (e) { alert(e); }
  };

  /* ===== LISTAR CATEGORIA ===== */
  qs('#btn-list-cat').onclick = async () => {
    try {
      const dados = await api('/categoria');
      qs('#cat-list-body').innerHTML = dados.map(c => 
        `<tr><td>${c.codigo}</td><td>${c.nome}</td></tr>`
      ).join('');
    } catch (e) { alert(e); }
  };

  /* ===== LISTAR VÍNCULO ===== */
  qs('#btn-list-vinc').onclick = async () => {
    try {
      const dados = await api('/livroCategoria');
      qs('#vinc-list-body').innerHTML = dados.map(v => 
        `<tr><td>${v.isbn}</td><td>${v.codigo}</td></tr>`
      ).join('');
    } catch (e) { alert(e); }
  };

  /* ===== ATUALIZAR VÍNCULO ===== */
qs('#btn-update-vinc').onclick = async () => {
  try {
    const isbn = qs('#vinc-isbn').value;
    const codigo = qs('#vinc-codigo').value;
    const novoCodigo = qs('#vinc-novo-codigo').value;

    if (!isbn || !codigo || !novoCodigo) {
      alert('Preencha ISBN, código atual e novo código.');
      return;
    }

    await api(`/livroCategoria/${isbn}/${codigo}`, 'PUT', { novoCodigo });

    alert('Vínculo atualizado com sucesso!');
  } catch (e) { alert(e); }
};


  /* ===== LISTAR EMPRÉSTIMO ===== */
  qs('#btn-list-loan').onclick = async () => {
    try {
      const dados = await api('/emprestimos');
      qs('#loan-list-body').innerHTML = dados.map(e => 
        `<tr><td>${e.id_emprestimo}</td><td>${e.cpf}</td><td>${e.isbn}</td><td>${e.status}</td></tr>`
      ).join('');
    } catch (e) { alert(e); }
  };

 



async function carregarEmprestimosCliente() {
  try {
    const dados = await api(`/emprestimos/cliente/${cpfLogado}`);
    qs('#client-loans').innerHTML = dados.map(e => `
      <tr>
        <td>${e.titulo}</td>
        <td>${formatarData(e.data_emprestimo)}</td>
        <td>${formatarData(e.data_devolucao)}</td>
        <td>${e.status}</td>
      </tr>
    `).join('');
  } catch (e) {
    alert(e);
  }
}


window.buscarEmprestimosAtivosCPF = async function () {
  const cpf = qs('#dev-cpf').value;

  if (!cpf) {
    alert('Digite o CPF.');
    return;
  }

  try {
    const dados = await api(`/emprestimos/ativos/cliente/${cpf}`);
    qs('#dev-list-body').innerHTML = dados.map(e => `
      <tr>
        <td>${e.id_emprestimo}</td>
        <td>${e.titulo}</td>
        <td>
          <button onclick="devolverEmprestimo(${e.id_emprestimo})">Devolver</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    alert(e);
  }
};

window.devolverEmprestimo = async function (id) {
  if (!confirm(`Deseja devolver o empréstimo ${id}?`)) return;

  try {
    await api(`/emprestimos/devolver/${id}`, 'PUT');
    alert('Devolvido com sucesso!');
    buscarEmprestimosAtivosCPF();
  } catch (e) {
    alert(e);
  }
};


window.buscarEmprestimosAtivosCPF = buscarEmprestimosAtivosCPF;
window.devolverEmprestimo = devolverEmprestimo;





  console.log('CRUD completo ligado sem quebrar nada ');

});

 

