'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface UserCard {
  id: string;
  name: string;
  avatar_url: string;
  email?: string;
}

const UserCards: React.FC = () => {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserCard | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("perfil")
        .select("id, name, avatar_url, email");

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Lógica para edição do usuário
    console.log("Editando usuário:", selectedUser);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    const { error } = await supabase
      .from("perfil")
      .delete()
      .eq("id", selectedUser.id);

    if (error) {
      console.error("Erro ao excluir usuário:", error);
      return;
    }

    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowModal(false);
  };

  const handleCardClick = (user: UserCard) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition"
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
            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl text-gray-800 font-bold mb-4">{selectedUser.name}</h2>
            <p className="text-gray-800 mb-2">Email: {selectedUser.email}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Excluir
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
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

export default UserCards;
