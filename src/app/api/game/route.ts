import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuestionWithAnswer {
  text: string;
  answer: boolean | null;
}

export async function POST(request: Request) {
  try {
    const { action, gameId, answer } = await request.json();

    if (action === 'start') {
      const game = await prisma.game.create({
        data: {
          status: 'IN_PROGRESS',
        },
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Akinator, a character guessing game. Ask a yes/no question to help guess the character. Keep questions specific and focused on one characteristic at a time."
          },
          {
            role: "user",
            content: "Start the game with a question"
          }
        ],
      });

      const question = completion.choices[0].message.content;

      await prisma.question.create({
        data: {
          text: question || "Is your character a human?",
          gameId: game.id,
        },
      });

      return NextResponse.json({ gameId: game.id, question });
    }

    if (action === 'answer') {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { questions: true },
      });

      if (!game) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
      }

      // Update the last question with the answer
      const lastQuestion = game.questions[game.questions.length - 1];
      await prisma.question.update({
        where: { id: lastQuestion.id },
        data: { answer },
      });

      // Generate next question or guess
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Akinator, a character guessing game. Based on the previous questions and answers, either ask another yes/no question or make a guess about the character."
          },
          {
            role: "user",
            content: `Previous questions and answers: ${game.questions.map((q) => `${q.text}: ${q.answer}`).join(', ')}`
          }
        ],
      });

      const response = completion.choices[0].message.content;

      if (response?.toLowerCase().includes('is it') || response?.toLowerCase().includes('are you')) {
        // This is a guess
        await prisma.guess.create({
          data: {
            character: response,
            gameId: game.id,
          },
        });

        return NextResponse.json({ guess: response });
      } else {
        // This is a question
        await prisma.question.create({
          data: {
            text: response || "Is your character famous?",
            gameId: game.id,
          },
        });

        return NextResponse.json({ question: response });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Game API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 