'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface UserCard {
  id: string;
  name: string;
  avatar_url?: string;  // opcional
  email?: string;
  papel?: string;
  last_access_at?: string;
}

const UserCardsWithLastAccess: React.FC = () => {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [lastAccessUsers, setLastAccessUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserCard | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editPapel, setEditPapel] = useState<string>("default");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: _error } = await supabase
        .from("perfil")
        .select("id, name, avatar_url, email, papel, last_access_at");

      if (_error) {
        console.error("Erro ao buscar usuários:", _error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastAccessUsers = async () => {
    try {
      const { data, error: _error } = await supabase
        .from("perfil")
        .select("id, name, last_access_at")
        .order("last_access_at", { ascending: false })
        .limit(5);

      if (_error) {
        console.error("Erro ao buscar últimos acessos:", _error);
        return;
      }

      setLastAccessUsers(data || []);
    } catch (error) {
      console.error("Erro ao buscar últimos acessos:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLastAccessUsers();
  }, []);

  const handleCardClick = (user: UserCard) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditPapel(user.papel ?? "default");
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("perfil")
        .update({ name: editName, papel: editPapel })
        .eq("id", selectedUser.id);

      if (error) {
        alert("Erro ao atualizar usuário: " + error.message);
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, name: editName, papel: editPapel } : u
        )
      );

      alert("Usuário atualizado com sucesso!");
      setSelectedUser(null);

      fetchLastAccessUsers();
    } catch (error) {
      alert("Erro ao atualizar usuário. " + error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    if (!confirm(`Tem certeza que deseja excluir o usuário ${selectedUser.name}?`)) return;

    try {
      const { error } = await supabase.from("perfil").delete().eq("id", selectedUser.id);

      if (error) {
        alert("Erro ao excluir usuário: " + error.message);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));

      alert("Usuário excluído com sucesso!");
      setSelectedUser(null);

      fetchLastAccessUsers();
    } catch (error) {
      alert("Erro ao excluir usuário. " + error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-16">Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-200 mb-5">
        Total de Usuários Cadastrados:{" "}
        <span className="text-white px-4 bg-green-500 p-2 rounded-md">
          {users.length}
        </span>
      </h1>

      {/* Lista dos usuários em cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-slate-600 shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-300 transition ${
              selectedUser?.id === user.id ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleCardClick(user)}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
              <Image
                src={user.avatar_url || "/placeholder-avatar.png"}
                alt={user.name}
                className="w-full h-full object-cover"
                width={128}
                height={128}
              />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">{user.name}</p>
            <p className="text-sm text-gray-300 capitalize"> <span className="font-bold text-gray-800">Papel:</span> <span className="bg-slate-800 px-3 py-2 rounded-md">{user.papel || "default"}</span> </p>
          </div>
        ))}
      </div>

      {/* Painel de edição/exclusão */}
      {selectedUser && (
        <div className="bg-white p-6 rounded-md shadow-md max-w-md mx-auto">
          <h2 className="text-xl text-gray-800 font-bold mb-4">Editar Usuário</h2>

          <label className="block mb-2 font-semibold text-gray-700">Nome</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full p-2 border border-gray-800 rounded mb-4 text-gray-800"
          />

          <label className="block mb-2 font-semibold text-gray-700">Papel</label>
          <select
            value={editPapel}
            onChange={(e) => setEditPapel(e.target.value)}
            className="w-full p-2 border border-gray-300 text-gray-800 rounded mb-4"
          >
            <option className="text-gray-800" value="default">Default</option>
            <option className="text-gray-800" value="admin">Admin</option>
            <option className="text-gray-800" value="cliente">Cliente</option>
          </select>

          <div className="flex justify-between">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Excluir
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Últimos acessos */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-200 mb-3">Últimos acessos</h2>
        <ul className="bg-slate-600 rounded-md p-4 space-y-3 w-full ">
          {lastAccessUsers.length === 0 && <p className="text-gray-500">Nenhum acesso registrado.</p>}
          {lastAccessUsers.map((access) => (
            <li key={access.id} className="flex justify-between border-b border-gray-200 p-2 hover:bg-gray-900 cursor-pointer">
              <span className="font-semibold text-gray-300">{access.name}</span>
              <span className="text-xs text-gray-300">
                {access.last_access_at
                  ? new Date(access.last_access_at).toLocaleString()
                  : "Não registrado"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserCardsWithLastAccess;
