"use client"

import { useEffect, useState } from "react"

type Props = {
  categoriaSelecionada: string
  setCategoriaSelecionada: (valor: string) => void
}

const icones: Record<string, string> = {
  Alimentação: "🍴",
  Mercado: "🛒",
  Mercados: "🛒",
  Beleza: "💄",
  Roupas: "👕",
  Serviços: "🛠️",
  Pets: "🐾",
  Informática: "💻",
  Artesanato: "🎨"
}

export default function CategoryGrid({
  categoriaSelecionada,
  setCategoriaSelecionada
}: Props) {

  const [categorias, setCategorias] = useState<any[]>([])

  useEffect(() => {

    async function carregar() {

      try {

        const resposta =
          await fetch("/api/categorias")

        const dados =
          await resposta.json()

        if (resposta.ok) {

          setCategorias(dados)

        }

      } catch (error) {

        console.log(error)

      }

    }

    carregar()

  }, [])

  return (

    <section
      id="categorias"
      className="max-w-7xl mx-auto px-6 py-10"
    >

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-black text-gray-900 dark:text-white">

          Categorias em destaque

        </h2>

        <button
          onClick={() =>
            setCategoriaSelecionada("")
          }
          className="text-orange-600 font-black hover:underline"
        >

          Ver todas

        </button>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {categorias.map((categoria) => (

          <button
            key={categoria.id_categoria}
            onClick={() =>
              setCategoriaSelecionada(
                categoria.nome
              )
            }
            className={`
              rounded-3xl
              p-6
              bg-white
              dark:bg-slate-900
              shadow-md
              hover:shadow-xl
              transition
              hover:-translate-y-2
              border

              ${
                categoriaSelecionada ===
                categoria.nome

                  ? "border-orange-500 ring-2 ring-orange-300"

                  : "border-gray-100 dark:border-slate-700"
              }
            `}
          >

            <div className="text-5xl mb-4">

              {
                icones[
                  categoria.nome
                ] || "🏪"
              }

            </div>

            <h3 className="font-black text-gray-900 dark:text-white">

              {categoria.nome}

            </h3>

          </button>

        ))}

      </div>

    </section>

  )

}