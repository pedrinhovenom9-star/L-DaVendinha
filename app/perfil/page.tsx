"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<any>(null)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [imagem, setImagem] = useState<File | null>(null)

    const [negocios, setNegocios] = useState<any[]>([])
    const [favoritos, setFavoritos] = useState<any[]>([])
    const [editarAberto, setEditarAberto] = useState(false)
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        const salvo = localStorage.getItem("usuario")

        if (!salvo) {
            window.location.href = "/login"
            return
        }

        const usuarioLogado = JSON.parse(salvo)

        setUsuario(usuarioLogado)
        setNome(usuarioLogado.nome)
        setEmail(usuarioLogado.email)

        buscarNegocios(usuarioLogado.id_usuario)
        buscarFavoritos(usuarioLogado.id_usuario)
    }, [])

    async function buscarNegocios(id_usuario: string) {
        const resposta = await fetch("/api/meus-negocios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_usuario })
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            setNegocios(dados)
        }
    }

    async function buscarFavoritos(id_usuario: string) {
        const resposta = await fetch(`/api/favoritos?id_usuario=${id_usuario}`)
        const dados = await resposta.json()

        if (resposta.ok) {
            setFavoritos(dados)
        }
    }

    async function uploadImagem() {
        if (!imagem) return ""

        const formData = new FormData()
        formData.append("arquivo", imagem)

        const resposta = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            return dados.url
        }

        return ""
    }

    async function salvarPerfil(e: React.FormEvent) {
        e.preventDefault()
        setCarregando(true)

        try {
            const fotoPerfil = await uploadImagem()

            const resposta = await fetch("/api/perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    nome,
                    email,
                    senhaAtual,
                    novaSenha,
                    foto_perfil: fotoPerfil
                })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                toast.error(dados.error || "Erro ao atualizar perfil")
                setCarregando(false)
                return
            }

            localStorage.setItem("usuario", JSON.stringify(dados.usuario))
            setUsuario(dados.usuario)
            setImagem(null)
            setSenhaAtual("")
            setNovaSenha("")
            setEditarAberto(false)

            toast.success("Perfil atualizado com sucesso!")
        } catch (error) {
            toast.error("Erro de conexão")
        }

        setCarregando(false)
    }

    if (!usuario) return null

    return (
        <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 px-6 py-10">
            <div className="max-w-7xl mx-auto">

                <div className="mb-6">
                    <Logo />
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-[45px] shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-10 py-14 text-white">

                        <div className="flex flex-col lg:flex-row items-center gap-10">

                            <div className="w-40 h-40 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 shadow-2xl flex items-center justify-center">
                                {usuario.foto_perfil ? (
                                    <img
                                        src={usuario.foto_perfil}
                                        alt={usuario.nome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-7xl font-black">
                                        {usuario.nome?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 text-center lg:text-left">
                                <p className="font-black bg-white/20 inline-block px-5 py-2 rounded-2xl mb-4">
                                    {usuario.tipo}
                                </p>

                                <h1 className="text-5xl font-black">
                                    {usuario.nome}
                                </h1>

                                <p className="text-orange-100 text-xl mt-3">
                                    {usuario.email}
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                                    <button
                                        onClick={() => setEditarAberto(!editarAberto)}
                                        className="bg-white text-orange-600 px-6 py-4 rounded-2xl font-black shadow-lg"
                                    >
                                        {editarAberto ? "Fechar edição" : "Editar perfil"}
                                    </button>

                                    <a
                                        href="/dashboard"
                                        className="bg-white/20 hover:bg-white/30 px-6 py-4 rounded-2xl font-black"
                                    >
                                        Dashboard
                                    </a>

                                    {usuario.tipo === "admin" && (
                                        <a
                                            href="/admin"
                                            className="bg-black/20 hover:bg-black/30 px-6 py-4 rounded-2xl font-black"
                                        >
                                            Painel admin
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 p-8">
                        <div className="bg-orange-50 dark:bg-slate-800 rounded-3xl p-6">
                            <p className="text-gray-500 dark:text-gray-300 font-bold">
                                Meus negócios
                            </p>
                            <h2 className="text-5xl font-black text-orange-600 mt-2">
                                {negocios.length}
                            </h2>
                        </div>

                        <div className="bg-orange-50 dark:bg-slate-800 rounded-3xl p-6">
                            <p className="text-gray-500 dark:text-gray-300 font-bold">
                                Favoritos
                            </p>
                            <h2 className="text-5xl font-black text-red-500 mt-2">
                                {favoritos.length}
                            </h2>
                        </div>

                        <div className="bg-orange-50 dark:bg-slate-800 rounded-3xl p-6">
                            <p className="text-gray-500 dark:text-gray-300 font-bold">
                                Status da conta
                            </p>
                            <h2 className="text-3xl font-black text-green-600 mt-3">
                                Ativa
                            </h2>
                        </div>
                    </div>
                </section>

                {editarAberto && (
                    <section className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-10 mt-8">
                        <h2 className="text-4xl font-black text-orange-600 mb-8">
                            Editar dados da conta
                        </h2>

                        <form onSubmit={salvarPerfil} className="space-y-6">

                            <div>
                                <label className="font-black text-gray-800 dark:text-white">
                                    Foto de perfil
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagem(e.target.files?.[0] || null)}
                                    className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 text-gray-900 dark:text-white"
                                />

                                {imagem && (
                                    <p className="text-orange-600 font-bold mt-2">
                                        Imagem selecionada: {imagem.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="font-black text-gray-800 dark:text-white">
                                        Nome
                                    </label>

                                    <input
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="font-black text-gray-800 dark:text-white">
                                        Email
                                    </label>

                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="font-black text-gray-800 dark:text-white">
                                        Senha atual
                                    </label>

                                    <input
                                        type="password"
                                        value={senhaAtual}
                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                        placeholder="Somente se for trocar senha"
                                        className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="font-black text-gray-800 dark:text-white">
                                        Nova senha
                                    </label>

                                    <input
                                        type="password"
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        placeholder="Nova senha"
                                        className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={carregando}
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition"
                            >
                                {carregando ? "Salvando..." : "Salvar alterações"}
                            </button>

                        </form>
                    </section>
                )}

                <section className="grid lg:grid-cols-2 gap-8 mt-8">

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
                            Meus negócios
                        </h2>

                        {negocios.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-300">
                                Nenhum negócio cadastrado.
                            </p>
                        )}

                        <div className="space-y-5">
                            {negocios.map((negocio) => (
                                <div
                                    key={negocio.id_negocio}
                                    className="border border-orange-100 dark:border-slate-700 rounded-3xl p-6"
                                >
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {negocio.nome}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                                        {negocio.descricao || "Sem descrição"}
                                    </p>

                                    <a
                                        href={`/negocio/${negocio.id_negocio}`}
                                        className="mt-5 inline-block bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black"
                                    >
                                        Ver negócio
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8">
                        <h2 className="text-4xl font-black text-red-500 mb-8">
                            ♥ Favoritos
                        </h2>

                        {favoritos.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-300">
                                Nenhum favorito salvo.
                            </p>
                        )}

                        <div className="space-y-5">
                            {favoritos.map((favorito) => (
                                <div
                                    key={favorito.id_favorito}
                                    className="border border-orange-100 dark:border-slate-700 rounded-3xl overflow-hidden"
                                >
                                    <div className="h-44 overflow-hidden">
                                        {favorito.negocio?.fotos?.length > 0 ? (
                                            <img
                                                src={favorito.negocio.fotos[0].url}
                                                alt={favorito.negocio.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                                                ♥
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                            {favorito.negocio?.nome}
                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-300 mt-2">
                                            {favorito.negocio?.descricao || "Sem descrição"}
                                        </p>

                                        <a
                                            href={`/negocio/${favorito.negocio?.id_negocio}`}
                                            className="mt-5 inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
                                        >
                                            Ver favorito
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

            </div>
        </main>
    )
}