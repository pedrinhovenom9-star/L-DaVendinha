export default function BusinessCard(){
  return(
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition">

      <div className="h-52 bg-gradient-to-br from-blue-300 to-cyan-300 flex items-center justify-center text-8xl">
        🍔
      </div>

      <div className="p-6">

        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-gray-800">
            Lanche do Zé
          </h3>

          <button>
            ❤️
          </button>
        </div>

        <p className="text-blue-600 font-semibold mt-2">
          Alimentação • 4.8 ⭐
        </p>

        <p className="text-gray-500 mt-4">
          Hambúrguer artesanal premium da região.
        </p>

        <a
          href="/negocio"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold"
        >
          Ver negócio
        </a>

      </div>

    </div>
  )
}