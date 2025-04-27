import { Character } from '../types/characters';

// Типы ответов API
interface QuestionResponse {
  gameId: string;
  question: {
    id: number;
    text: string;
    textEn: string;
  };
  progress: number;
}

interface ResultResponse {
  gameId: string;
  result: Character;
  progress: number;
}

// API клиент для взаимодействия с бэкендом
class AkinatorApiClient {
  private apiBaseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.apiBaseUrl = baseUrl;
  }

  // Начать новую игру
  async startGame(): Promise<QuestionResponse> {
    // Здесь будет реальный запрос к API
    return {
      gameId: 'game-123',
      question: {
        id: 1,
        text: 'Ваш персонаж реальный человек?',
        textEn: 'Is your character a real person?'
      },
      progress: 0
    };
  }

  // Перезапустить игру
  async restartGame(gameId?: string): Promise<QuestionResponse> {
    console.log('Restarting game with ID:', gameId);
    // Здесь будет реальный запрос к API
    return this.startGame();
  }
}

// Создаем и экспортируем экземпляр API клиента
export const akinatorApi = new AkinatorApiClient(); 