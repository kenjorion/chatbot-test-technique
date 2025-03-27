import { NextResponse, NextRequest } from 'next/server';
 import { prisma } from '@/lib/prisma';
 
 /**
  * Route API pour récupérer les items
  * Méthode: GET
  * @returns la liste des lieux
  */
 
 export async function GET(req: Request) {
   try {
     // Récupérer les paramètres de la requête
     const { searchParams } = new URL(req.url);
     let categoryFilter = searchParams.get('itemCategoryFilter') || '';
     if (categoryFilter === 'all') categoryFilter = '';
     const where = categoryFilter !== '' ? { category: categoryFilter as string } : {};
 
     // Récupérer les objets depuis la base de données avec un filtre sur le type
     const items = await prisma.item.findMany({
        where
     });
 
     return NextResponse.json(items, { status: 201 });
   } catch (error) {
     console.error('Erreur lors de la récupération des lieux:', error);
 
     // Retourner une erreur 500 en cas d'échec
     return NextResponse.json(
         { error: 'Erreur lors de la récupération des lieux' },
         { status: 500 }
     );
   }
 }