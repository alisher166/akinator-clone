import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { 
  Character, 
  Question, 
  GameState, 
  Answer,
  ApiResponse 
} from '../../shared/types';

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Загрузка данных из JSON файлов
const charactersPath = path.join(__dirname, 'data', 'characters.json');
const questionsPath = path.join(__dirname, 'data', 'questions.json');

const characters: Character[] = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));
const questions: Question[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

// Локальное хранилище для состояний игр (в реальном приложении здесь был бы Redis или другая БД)
const gameStates: Map<string, GameState> = new Map();

// Утилиты
function generateGameId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Получить наиболее информативный вопрос для текущего набора персонажей
function getNextQuestion(possibleCharacters: Character[], answeredQuestions: number[]): Question | null {
  // Если персонажей не осталось или остался только один, не задаем вопросов
  if (possibleCharacters.length <= 1) {
    return null;
  }

  // Отфильтровываем уже заданные вопросы
  const unansweredQuestions = questions.filter(q => !answeredQuestions.includes(q.id));
  
  if (unansweredQuestions.length === 0) {
    return null;
  }

  // Найдем вопрос, который разделит набор персонажей наиболее равномерно
  let bestQuestion = unansweredQuestions[0];
  let bestScore = Number.MAX_VALUE;

  for (const question of unansweredQuestions) {
    const traitKey = question.traitKey;
    
    // Считаем, сколько персонажей имеют данную черту и сколько нет
    const withTrait = possibleCharacters.filter(char => char.traits[traitKey] === true).length;
    const withoutTrait = possibleCharacters.length - withTrait;
    
    // Чем ближе соотношение к 50/50, тем лучше вопрос
    const score = Math.abs(withTrait - withoutTrait);
    
    if (score < bestScore) {
      bestScore = score;
      bestQuestion = question;
    }
  }

  return bestQuestion;
}

// Фильтрация персонажей по ответам
function filterCharacters(
  characters: Character[], 
  questionId: number, 
  answer: Answer
): Character[] {
  const question = questions.find(q => q.id === questionId);
  
  if (!question || answer === null) {
    return characters; // Если не знаем ответ, не фильтруем
  }

  return characters.filter(char => {
    const hasTrait = char.traits[question.traitKey] === true;
    return answer ? hasTrait : !hasTrait;
  });
}

// Получить вероятность правильного ответа
function calculateProgress(possibleCharacters: Character[], totalCharacters: number): number {
  // Чем меньше возможных персонажей, тем выше прогресс
  const percentage = 100 - (possibleCharacters.length / totalCharacters * 100);
  return Math.min(Math.max(0, percentage), 100);
}

// Маршруты API

// GET /api/questions - получить следующий вопрос
app.get('/api/questions', (req, res) => {
  const gameId = req.query.gameId as string;
  let response: ApiResponse<any> = { success: false };

  if (!gameId) {
    // Создаем новую игру
    const newGameId = generateGameId();
    const initialQuestion = getNextQuestion(characters, []);
    
    if (!initialQuestion) {
      response = { success: false, error: 'Не удалось сгенерировать вопрос' };
      return res.status(500).json(response);
    }

    const newGameState: GameState = {
      currentQuestion: initialQuestion,
      answeredQuestions: [],
      progress: 0,
      possibleCharacters: [...characters],
      result: null
    };

    gameStates.set(newGameId, newGameState);

    response = { 
      success: true, 
      data: {
        gameId: newGameId,
        question: {
          id: initialQuestion.id,
          text: initialQuestion.text,
          textEn: initialQuestion.textEn
        },
        progress: 0
      }
    };
  } else {
    // Получаем существующую игру
    const gameState = gameStates.get(gameId);
    
    if (!gameState) {
      response = { success: false, error: 'Игра не найдена' };
      return res.status(404).json(response);
    }

    if (gameState.result) {
      // Если у нас уже есть результат, возвращаем его
      response = { 
        success: true, 
        data: {
          gameId,
          result: gameState.result,
          progress: gameState.progress
        }
      };
    } else if (gameState.currentQuestion) {
      // Возвращаем текущий вопрос
      response = { 
        success: true, 
        data: {
          gameId,
          question: {
            id: gameState.currentQuestion.id,
            text: gameState.currentQuestion.text,
            textEn: gameState.currentQuestion.textEn
          },
          progress: gameState.progress
        }
      };
    } else {
      response = { success: false, error: 'Неизвестное состояние игры' };
      return res.status(500).json(response);
    }
  }

  res.json(response);
});

// POST /api/answer - отправить ответ на вопрос
app.post('/api/answer', (req, res) => {
  const { gameId, questionId, answer } = req.body;
  let response: ApiResponse<any> = { success: false };

  if (!gameId || questionId === undefined || answer === undefined) {
    response = { success: false, error: 'Отсутствуют обязательные параметры' };
    return res.status(400).json(response);
  }

  const gameState = gameStates.get(gameId);
  
  if (!gameState) {
    response = { success: false, error: 'Игра не найдена' };
    return res.status(404).json(response);
  }

  // Добавляем ответ на вопрос
  gameState.answeredQuestions.push({ questionId, answer });

  // Фильтруем персонажей на основе ответа
  gameState.possibleCharacters = filterCharacters(
    gameState.possibleCharacters, 
    questionId, 
    answer
  );

  // Обновляем прогресс
  gameState.progress = calculateProgress(gameState.possibleCharacters, characters.length);

  // Проверяем, можем ли мы угадать персонажа
  if (gameState.possibleCharacters.length === 1) {
    // Мы нашли персонажа!
    gameState.result = gameState.possibleCharacters[0];
    gameState.currentQuestion = null;
    
    response = { 
      success: true, 
      data: {
        gameId,
        result: gameState.result,
        progress: 100
      }
    };
  } else if (gameState.possibleCharacters.length === 0) {
    // Не нашли персонажа
    response = { 
      success: true, 
      data: {
        gameId,
        result: null,
        message: 'Я не могу угадать вашего персонажа. Вы выиграли!',
        progress: gameState.progress
      }
    };
  } else {
    // Генерируем следующий вопрос
    const answeredIds = gameState.answeredQuestions.map(a => a.questionId);
    const nextQuestion = getNextQuestion(gameState.possibleCharacters, answeredIds);
    
    if (nextQuestion) {
      gameState.currentQuestion = nextQuestion;
      
      response = { 
        success: true, 
        data: {
          gameId,
          question: {
            id: nextQuestion.id,
            text: nextQuestion.text,
            textEn: nextQuestion.textEn
          },
          progress: gameState.progress
        }
      };
    } else {
      // Не осталось вопросов, но есть несколько вариантов
      // Выберем первый как наиболее вероятный
      gameState.result = gameState.possibleCharacters[0];
      gameState.currentQuestion = null;
      
      response = { 
        success: true, 
        data: {
          gameId,
          result: gameState.result,
          progress: 95, // Мы не на 100% уверены
          possibleResults: gameState.possibleCharacters.slice(0, 3) // Возвращаем несколько вариантов
        }
      };
    }
  }

  // Сохраняем обновленное состояние
  gameStates.set(gameId, gameState);
  
  res.json(response);
});

// GET /api/restart - начать новую игру
app.get('/api/restart', (req, res) => {
  const gameId = req.query.gameId as string;
  
  if (gameId) {
    // Удаляем существующую игру
    gameStates.delete(gameId);
  }
  
  // Создаем новую игру
  const newGameId = generateGameId();
  const initialQuestion = getNextQuestion(characters, []);
  
  if (!initialQuestion) {
    const response: ApiResponse<any> = { success: false, error: 'Не удалось сгенерировать вопрос' };
    return res.status(500).json(response);
  }

  const newGameState: GameState = {
    currentQuestion: initialQuestion,
    answeredQuestions: [],
    progress: 0,
    possibleCharacters: [...characters],
    result: null
  };

  gameStates.set(newGameId, newGameState);

  const response: ApiResponse<any> = { 
    success: true, 
    data: {
      gameId: newGameId,
      question: {
        id: initialQuestion.id,
        text: initialQuestion.text,
        textEn: initialQuestion.textEn
      },
      progress: 0
    }
  };
  
  res.json(response);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🧞‍♂️ Akinator API работает на порту ${PORT}`);
}); 