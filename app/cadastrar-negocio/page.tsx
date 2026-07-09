"use client"

import { useEffect, useState } from "react"
import Logo from "../../components/Logo"

export default function CadastrarNegocio() {
  const [usuario, setUsuario] = useState<any>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [idCategoria, setIdCategoria] = useState("")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [cep, setCep] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)


  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario")

    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage))
      buscarCategorias()
    }
  }, [])

  async function buscarCep(valorCep: string) {
    const cepLimpo = valorCep.replace(/\D/g, "")

    setCep(valorCep)

    if (cepLimpo.length !== 8) return

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      )

      const dados = await resposta.json()

      if (dados.erro) {
        return
      }

      setRua(dados.logradouro || "")
      setBairro(dados.bairro || "")
      setCidade(dados.localidade || "")
      setEstado(dados.uf || "")
    } catch (error) {
      console.log("Erro ao buscar CEP", error)
    }
  }

  async function buscarCategorias() {
    const resposta = await fetch("/api/categorias")
    const dados = await resposta.json()

    if (resposta.ok) {
      setCategorias(dados)

      if (dados.length > 0) {
        setIdCategoria(dados[0].id_categoria)
      }
    }
  }

  async function cadastrarNegocio(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setMensagem("")

    if (!usuario) {
      setMensagem("Você precisa fazer login antes de cadastrar um negócio.")
      setCarregando(false)
      return
    }

    let urlImagem = ""

    if (imagem) {
      const formData = new FormData()
      formData.append("arquivo", imagem)

      const upload = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      const uploadDados = await upload.json()

      if (upload.ok) {
        urlImagem = uploadDados.url
      }
    }

    const resposta = await fetch("/api/negocios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        nome,
        descricao,
        telefone,
        horario_funcionamento: horario,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        imagem: urlImagem,
        id_categoria: idCategoria
      })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setMensagem("Negócio cadastrado com sucesso!")

      setNome("")
      setDescricao("")
      setTelefone("")
      setHorario("")
      setRua("")
      setNumero("")
      setBairro("")
      setCidade("")
      setEstado("")
      setCep("")
      setImagem(null)
    } else {
      setMensagem(dados.error || "Erro ao cadastrar negócio.")
    }

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 py-20 px-6">

      <div className="max-w-5xl mx-auto mb-6">
        <Logo />
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-12 text-white">
          <div className="flex items-center gap-4">

            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-5xl">
              🏪
            </div>

            <div>
              <h1 className="text-5xl font-black">
                Cadastre seu negócio
              </h1>

              <p className="text-orange-100 mt-2 text-lg">
                Divulgue sua empresa para milhares de clientes.
              </p>
            </div>

          </div>

          <p className="mt-4 text-orange-100 text-lg">
            Divulgue sua loja, serviço ou empreendimento na sua região.
          </p>
        </div>

        {!usuario && (
          <div className="m-10 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 font-bold">
            Você precisa estar logado para cadastrar um negócio.
            <a href="/login?redirect=/cadastrar-negocio" className="ml-2 underline">
              Entrar agora
            </a>
          </div>
        )}

        <form onSubmit={cadastrarNegocio} className="p-10 space-y-6">

          <div>
            <label className="font-bold text-gray-700">
              Foto principal do negócio
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arquivo = e.target.files?.[0]

                if (arquivo) {
                  setImagem(arquivo)
                  setPreview(URL.createObjectURL(arquivo))
                }
              }}
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            />

            {preview && (
              <div className="mt-4 overflow-hidden rounded-3xl border border-orange-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            {imagem && (
              <p className="mt-2 text-sm text-orange-600 font-bold">
                Imagem selecionada: {imagem.name}
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-gray-700">
              Nome do negócio
            </label>

            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Lanche do Zé"
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">
              Categoria do negócio
            </label>

            <select
              required
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            >
              {categorias.map((categoria) => (
                <option
                  key={categoria.id_categoria}
                  value={categoria.id_categoria}
                >
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">
              Descrição
            </label>

            <textarea
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Fale sobre seu negócio..."
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 h-36 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-bold text-gray-700">
                Telefone
              </label>

              <input
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(19) 99999-9999"
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700">
                Horário de funcionamento
              </label>

              <input
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex: Segunda a sábado, 10h às 22h"
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="border-t border-orange-100 pt-8">

            <h2 className="text-3xl font-black text-orange-600 flex items-center gap-3">
              📍 Endereço do negócio
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <input required value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500" />
            <input required value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500" />
            <input required value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500" />
            <input required value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500" />
            <input required value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500" />
            <input
              required
              value={cep}
              onChange={(e) => buscarCep(e.target.value)}
              placeholder="CEP"
              className="border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            />
          </div>

          <button
            disabled={carregando || !usuario}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 transition text-white font-black py-5 rounded-2xl text-xl shadow-xl"
          >
            {carregando ? "Cadastrando..." : "Cadastrar negócio"}
          </button>

          {mensagem && (
            <p className="text-center font-bold text-orange-700">
              {mensagem}
            </p>
          )}

        </form>
      </div>
    </main>
  )
}