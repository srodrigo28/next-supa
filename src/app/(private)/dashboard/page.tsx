'use client';

import Header from "@/components/header";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("Usuário não autenticado.");
        return;
      }

      const { data, error } = await supabase
        .from("perfil")
        .select("papel")
        .eq("user_id", session.user.id)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar perfil do usuário:", error || "Perfil não encontrado.");
        return;
      }

      setIsAdmin(data.papel === "admin");
    } catch (error) {
      console.error("Erro ao buscar informações do perfil:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Link href="/perfil">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4">
            Perfil
          </button>
        </Link>

      {isAdmin && (
        <Link href="/admin">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
            Admin
          </button>
        </Link>
      )}
    </div>
  );
}