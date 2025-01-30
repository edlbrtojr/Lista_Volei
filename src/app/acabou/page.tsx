export default function Acabou() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Nenhum Vôlei Agendado</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aguarde o agendamento do próximo jogo.
        </p>
      </div>
    </div>
  );
}
