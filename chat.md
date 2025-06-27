-- Versão start

Aqui está o código para sua aplicação em Next.js com TypeScript. Ele utiliza a biblioteca do Supabase para listar e cadastrar produtos em uma tabela chamada produto.

Configuração inicial
Certifique-se de:

Configurar o Supabase no projeto.

Instalar a biblioteca do Supabase no projeto com:

bash
Copiar
Editar
npm install @supabase/supabase-js
Criar a tabela produto com os campos id, nome, qtd, preco, foto.

Criar o arquivo supabaseClient.ts
No diretório src/lib, crie um arquivo supabaseClient.ts para inicializar o cliente do Supabase:

typescript
Copiar
Editar
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
Criar o componente Home.tsx
Aqui está a página Home com a funcionalidade de listar e cadastrar produtos:

typescript
Copiar
Editar
// src/pages/home.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Produto {
  id?: number;
  nome: string;
  qtd: number;
  preco: number;
  foto?: string;
}

const Home: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState<Produto>({
    nome: '',
    qtd: 0,
    preco: 0,
    foto: '',
  });

  const fetchProdutos = async () => {
    const { data, error } = await supabase.from('produto').select('*');
    if (error) console.error(error);
    else setProdutos(data);
  };

  const handleAddProduto = async () => {
    const { data, error } = await supabase.from('produto').insert([novoProduto]);
    if (error) console.error(error);
    else {
      setProdutos((prev) => [...prev, ...data]);
      setNovoProduto({ nome: '', qtd: 0, preco: 0, foto: '' });
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Cadastrar Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={novoProduto.nome}
            onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={novoProduto.qtd}
            onChange={(e) => setNovoProduto({ ...novoProduto, qtd: +e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Preço"
            value={novoProduto.preco}
            onChange={(e) => setNovoProduto({ ...novoProduto, preco: +e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="URL da Foto"
            value={novoProduto.foto}
            onChange={(e) => setNovoProduto({ ...novoProduto, foto: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddProduto}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar Produto
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Lista de Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="p-4 border rounded shadow">
              <h3 className="text-lg font-bold">{produto.nome}</h3>
              <p>Quantidade: {produto.qtd}</p>
              <p>Preço: R${produto.preco.toFixed(2)}</p>
              {produto.foto && (
                <img src={produto.foto} alt={produto.nome} className="mt-2 w-full h-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
Estilo com Tailwind CSS
Certifique-se de que o Tailwind CSS está configurado no seu projeto. Caso contrário, instale-o seguindo a documentação oficial do Tailwind CSS.

Variáveis de ambiente
No arquivo .env.local, adicione as seguintes variáveis:

plaintext
Copiar
Editar
NEXT_PUBLIC_SUPABASE_URL=seu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-supabase-anon-key
Isso criará uma aplicação funcional para listar e cadastrar produtos. 🎉