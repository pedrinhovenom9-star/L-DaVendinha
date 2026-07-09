"use client"

import Logo from "./Logo"
import UserMenu from "./UserMenu"

type NavbarProps = {
  busca?: string
  setBusca?: (valor: string) => void
}

export default function Navbar({ busca = "", setBusca }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">

        <Logo />

        <div className="hidden lg:flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <input
            value={busca}
            onChange={(e) => setBusca && setBusca(e.target.value)}
            placeholder="Buscar negócios, produtos..."
            className="flex-1 px-5 py-4 outline-none bg-transparent text-gray-800"
          />

          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 text-2xl">
            🔎
          </button>
        </div>

        <UserMenu />

      </div>

      <nav className="bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-10 font-black">
            <a href="/" className="py-5 border-b-4 border-white">
              Início
            </a>

            <a href="#negocios" className="py-5 hover:text-orange-100">
              Negócios
            </a>

            <a href="/produtos" className="py-5 hover:text-orange-100">
              Produtos
            </a>

            <a href="#categorias" className="py-5 hover:text-orange-100">
              Categorias
            </a>

            <a href="/perfil" className="py-5 hover:text-orange-100">
              Favoritos
            </a>
          </div>

          <a
            href="/cadastrar-negocio"
            className="hidden md:block bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-black"
          >
            + Cadastrar negócio
          </a>

        </div>
      </nav>

    </header>
  )
}