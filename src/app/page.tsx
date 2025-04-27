'use client';

import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [guess, setGuess] = useState<string | null>(null);

  const startGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      const data = await response.json();
      setGameId(data.gameId);
      setCurrentQuestion(data.question);
      setIsGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: boolean) => {
    if (!gameId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'answer',
          gameId,
          answer,
        }),
      });

      const data = await response.json();
      
      if (data.guess) {
        setGuess(data.guess);
        setCurrentQuestion('');
      } else {
        setCurrentQuestion(data.question);
      }
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setCurrentQuestion('');
    setGameId(null);
    setGuess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {!isGameStarted ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-8">
              Добро пожаловать в Akinator Clone!
            </h1>
            <p className="text-xl text-purple-600 mb-8">
              Загадайте любого персонажа, и я попробую его угадать!
            </p>
            <button
              onClick={startGame}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Начать игру | Start Game
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <SparklesIcon className="h-12 w-12 text-purple-500" />
              <h2 className="text-2xl font-bold text-purple-800 ml-4">
                {guess ? 'Мой ответ | My Guess' : 'Вопрос | Question'}
              </h2>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : (
              <>
                <p className="text-xl text-gray-700 mb-8 text-center">
                  {guess || currentQuestion || "Загружаю вопрос..."}
                </p>
                {!guess && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Да | Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Нет | No
                    </button>
                  </div>
                )}
                {guess && (
                  <div className="text-center">
                    <button
                      onClick={resetGame}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Играть снова | Play Again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
