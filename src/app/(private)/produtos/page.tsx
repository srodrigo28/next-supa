
'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface Produto {
  id?: number;
  nome: string;
  qtd: number;
  preco: number;
  foto?: string;
}

const Home: React.FC = () => {

  /**  Controles de estados */
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState<Produto>({
    nome: '',
    qtd: 0,
    preco: 0,
    foto: '',
  });
  const [detalhesProduto, setDetalhesProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /** Funções Actions */
  const fetchProdutos = async () => {
    const { data, error } = await supabase.from('produto').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error);
    } else {
      setProdutos(data || []);
    }
  };
  const handleAddProduto = async () => {
    const { data, error } = await supabase.from('produto').insert([novoProduto]);
    if (error) {
      console.error('Erro ao adicionar produto:', error);
    } else if (data) {
      setProdutos((prev) => [...prev, ...data]);
      setNovoProduto({ nome: '', qtd: 0, preco: 0, foto: '' });
    }
  };

  const handleUpdateProduto = async () => {
    if (!detalhesProduto || !detalhesProduto.id) return;

    const { data, error } = await supabase
      .from('produto')
      .update({
        nome: detalhesProduto.nome,
        qtd: detalhesProduto.qtd,
        preco: detalhesProduto.preco,
        foto: detalhesProduto.foto,
      })
      .eq('id', detalhesProduto.id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
    } else if (data) {
      setProdutos((prev) =>
        prev.map((prod) => (prod.id === detalhesProduto.id ? data[0] : prod))
      );
      setIsEditing(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteProduto = async () => {
    if (!detalhesProduto || !detalhesProduto.id) return;

    const { error } = await supabase.from('produto').delete().eq('id', detalhesProduto.id);

    if (error) {
      console.error('Erro ao excluir produto:', error);
    } else {
      setProdutos((prev) => prev.filter((prod) => prod.id !== detalhesProduto.id));
      setIsModalOpen(false);
    }
  };

  const handleShowDetalhes = (produto: Produto) => {
    setDetalhesProduto(produto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetalhesProduto(null);
    setIsEditing(false);
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
                <Image src={produto.foto} alt={produto.nome} className="mt-2 w-full h-auto" width={128} height={128} />
              )}
              <button
                onClick={() => handleShowDetalhes(produto)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Detalhes
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && detalhesProduto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Editar Produto' : 'Detalhes do Produto'}
            </h2>
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={detalhesProduto.nome}
                  onChange={(e) =>
                    setDetalhesProduto({ ...detalhesProduto, nome: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="number"
                  placeholder="Quantidade"
                  value={detalhesProduto.qtd}
                  onChange={(e) =>
                    setDetalhesProduto({ ...detalhesProduto, qtd: +e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={detalhesProduto.preco}
                  onChange={(e) =>
                    setDetalhesProduto({ ...detalhesProduto, preco: +e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="URL da Foto"
                  value={detalhesProduto.foto}
                  onChange={(e) =>
                    setDetalhesProduto({ ...detalhesProduto, foto: e.target.value })
                  }
                  className="p-2 border rounded w-full mb-4"
                />
                <button
                  onClick={handleUpdateProduto}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <>
                <p><strong>Nome:</strong> {detalhesProduto.nome}</p>
                <p><strong>Quantidade:</strong> {detalhesProduto.qtd}</p>
                <p><strong>Preço:</strong> R${detalhesProduto.preco.toFixed(2)}</p>
                {detalhesProduto.foto && (
                  <Image src={detalhesProduto.foto} alt={detalhesProduto.nome} className="mt-4 w-full h-auto" width={128} height={128} />
                )}
              </>
            )}
            <div className="flex justify-between mt-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
              )}
              <button
                onClick={handleDeleteProduto}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Excluir
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Home;