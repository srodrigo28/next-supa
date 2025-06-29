'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoMailOpenOutline } from "react-icons/io5";
import { PiKey } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa o erro antes de tentar autenticar

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciais inválidas. Tente novamente.");
    } else {
      router.push("/dashboard"); // Redireciona após login bem-sucedido
    }
  };

  return (
    <div className="flex w-screen h-screen bg-slate-800">
      {/* Seção Mobile */}
      <div
        className="h-screen flex items-center justify-center flex-col w-full md:w-[30%] md:min-w-[320px] 
        md:max-w-[400px] bg-slate-100 md:block text-gray-800 "
      >
        <div className="w-[100%] md:mt-5 flex flex-col items-center justify-center">
          <Image
            src="/svg/logo.svg"
            alt="logo.svg"
            width={200}
            height={200}
            className="mt-12 mb-10"
          />
          <h1 className="text-2xl font-bold">Seja bem vindo</h1>
        </div>

        <form className="w-[100%]" onSubmit={handleLogin}>
          <div className="input-wrapper flex flex-col p-5">
            <label className="text-sm font-semibold">E-mail</label>
            <div className="flex items-center justify-center">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-class"
                required
              />
              <div className="icon-box">
                <IoMailOpenOutline className="icon-box-icon" />
              </div>
            </div>

            <label className="text-sm mt-3 font-semibold">Senha</label>
            <div className="flex items-center justify-center">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-class"
                required
              />
              <div className="icon-box">
                <PiKey className="icon-box-icon" />
              </div>
            </div>
            <span className="text-end mt-2 text-xs text-purple-700 cursor-pointer hover:underline hover:text-sm duration-300 font-semibold">
              Esqueci minha senha?
            </span>
          </div>

          <div className="button-wrapper w-[100%] flex flex-col items-center p-5">
            <button
              type="submit"
              className="w-[100%] mb-7 bg-primary text-white p-2 rounded-md tracking-wide font-semibold"
            >
              Entrar
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center text-red-500 text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="button-wrapper w-[100%] flex flex-col items-center p-5">
          <div className="box-ou">
            <span className="h-1 bg-primary flex-1"></span>
            <span>Ou</span>
            <span className="h-1 bg-primary flex-1"></span>
          </div>

          <Link href="/cadastro-user" className="w-full">
            <button className="w-[100%] mt-7 bg-gray-300 font-semibold tracking-wide text-gray-900 p-2 rounded-md">
              Cadastre-se
            </button>
          </Link>
        </div>
      </div>
      {/* Seção Desktop */}
      <div className="hidden md:flex h-screen md:flex-1 bg-gray-200 justify-center items-center">
        <Image src="/svg/main.svg" alt="login.svg" width={600} height={600} />
      </div>
    </div>
  );
};

export default Home;
