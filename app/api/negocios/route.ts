import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get("busca") || ""

    const negocios = await prisma.negocio.findMany({
      where: busca
        ? {
            OR: [
              { nome: { contains: busca } },
              { descricao: { contains: busca } },
              { endereco: { cidade: { contains: busca } } },
              { endereco: { bairro: { contains: busca } } }
            ]
          }
        : {},

      include: {
        usuario: true,
        endereco: true,
        fotos: true,
        produtos: true,
        avaliacoes: true
      },

      orderBy: {
        data_criacao: "desc"
      }
    })

    return NextResponse.json(negocios)

  } catch (error) {
    console.log("ERRO API NEGOCIOS:", error)

    return NextResponse.json(
      { error: "Erro ao buscar negócios" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.id_usuario) {
      return NextResponse.json(
        { error: "Usuário não identificado" },
        { status: 401 }
      )
    }

    const negocio = await prisma.negocio.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        telefone: body.telefone,
        horario_funcionamento: body.horario_funcionamento || "Não informado",
        status: "ativo",
        id_usuario: body.id_usuario,

        endereco: {
          create: {
            rua: body.rua,
            numero: body.numero,
            bairro: body.bairro,
            cidade: body.cidade,
            estado: body.estado,
            cep: body.cep
          }
        },

        fotos: body.imagem
          ? {
              create: {
                url: body.imagem,
                descricao: "Foto principal",
                foto_principal: true
              }
            }
          : undefined
      },

      include: {
        endereco: true,
        fotos: true,
        produtos: true,
        avaliacoes: true
      }
    })

    return NextResponse.json({
      message: "Negócio cadastrado",
      negocio
    })

  } catch (error) {
    console.log("ERRO CADASTRAR NEGOCIO:", error)

    return NextResponse.json(
      { error: "Erro ao cadastrar negócio" },
      { status: 500 }
    )
  }
}