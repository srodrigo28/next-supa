'use client';

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserData {
  name: string;
  email: string;
  avatar_url: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("perfil")
        .select("name, email, avatar_url")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar dados do usuário:", error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!user) {
    return <div className="flex justify-center items-center h-16 bg-gray-100">Carregando...</div>;
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900 shadow-md">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
          <Image
            src={user.avatar_url || "/placeholder-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
            width={128}
            height={128}
          />
        </div>
        <div>
          <p className="text-sm font-bold">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
