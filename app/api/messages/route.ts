import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour créer un nouveau message
 * Méthode: POST
 * @param request Requête HTTP contenant le contenu du message et l'ID de la conversation
 * @returns Le message créé avec un statut 201 ou une erreur
 */
export async function POST(request: Request) {
  try {
    // Extraire les données de la requête
    const { content, conversationId } = await request.json();

    // Vérifier que les données requises sont présentes
    if (!content || !conversationId) {
      return NextResponse.json(
        { error: 'Le contenu du message et l\'ID de la conversation sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la conversation existe
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Créer le message dans la base de données
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        isUserMessage: true,
      },
    });

    // Retourner le message créé avec un statut 201 (Created)
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    
    // Retourner une erreur 500 en cas d'échec
    return NextResponse.json(
      { error: 'Erreur lors de la création du message' },
      { status: 500 }
    );
  }
}
