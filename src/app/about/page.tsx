export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-purple-800 mb-8 text-center">
        О игре | About the Game
      </h1>
      
      <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Как играть | How to Play
          </h2>
          <p className="text-gray-700">
            1. Загадайте любого персонажа (реального или вымышленного)
            <br />
            2. Отвечайте на вопросы ИИ "Да" или "Нет"
            <br />
            3. ИИ попытается угадать вашего персонажа
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Технологии | Technologies
          </h2>
          <p className="text-gray-700">
            - Next.js 14 для фронтенда
            <br />
            - OpenAI API для генерации вопросов и угадывания
            <br />
            - PostgreSQL для хранения данных
            <br />
            - Prisma как ORM
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Особенности | Features
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Умный ИИ, который учится на ваших ответах</li>
            <li>Адаптивный дизайн для всех устройств</li>
            <li>Многоязычный интерфейс (Русский/Английский)</li>
            <li>Быстрые и точные вопросы</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 