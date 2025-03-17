# Test Technique React - Chatbot

Ce repository contient une application de chatbot simple développée avec React, Next.js, Tailwind CSS et Prisma. Ce projet servira de base pour évaluer vos compétences en développement et votre capacité à analyser et améliorer du code existant.

## 📋 Description du projet

L'application est un chatbot minimaliste qui permet à l'utilisateur d'envoyer des messages et de recevoir des réponses simples. Le chatbot répond toujours par "Merci pour votre message !". Les conversations et les messages sont stockés dans une base de données SQLite via Prisma.

### Fonctionnalités actuelles

- Interface utilisateur avec Tailwind CSS
- Création automatique d'une nouvelle conversation
- Envoi et réception de messages
- Faux chargement pendant que le bot "réfléchit"
- Possibilité de démarrer une nouvelle conversation
- Stockage des conversations et messages en base de données

## 🚀 Installation et démarrage

Pour faire fonctionner le projet localement, suivez ces étapes :

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd chatbot-test
```

2. Installez les dépendances :
```bash
npm install
```

3. Générez le client Prisma et créez la base de données :
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Initialisez les données de test pour la partie 2 (les fichiers CSV sont déjà présents dans le dossier `data/`) :
```bash
npm run seed
```

5. Lancez l'application en mode développement :
```bash
npm run dev
```

6. Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

Pour explorer les données de la base, vous pouvez utiliser Prisma Studio :
```bash
npx prisma studio
```

## 🔍 Structure du projet

```
├── app/                  # Dossier principal de l'application Next.js
│   ├── api/              # Routes API
│   │   ├── conversations/# API pour les conversations
│   │   └── messages/     # API pour les messages
│   ├── components/       # Composants React
│   │   ├── Chatbot.tsx   # Composant principal du chatbot
│   │   ├── ChatInput.tsx # Composant de saisie de message
│   │   └── MessageList.tsx # Composant d'affichage des messages
│   └── page.tsx          # Page principale de l'application
├── data/                 # Données CSV pour la partie 2
│   ├── options.csv       # Options de questions
│   ├── locations.csv     # Lieux disponibles
│   └── items.csv         # Articles disponibles
├── lib/                  # Utilitaires
│   └── prisma.ts         # Client Prisma
├── prisma/               # Configuration Prisma
│   ├── schema.prisma     # Schéma de la base de données
│   ├── seed.ts           # Script d'initialisation des données
│   └── dev.db            # Base de données SQLite
└── tailwind.config.ts    # Configuration de Tailwind CSS
```

## 📊 Schéma de la base de données

Le schéma actuel de la base de données comprend deux modèles :

```prisma
model Conversation {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(uuid())
  content        String
  isUserMessage  Boolean      @default(true)
  createdAt      DateTime     @default(now())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}
```

Pour visualiser les données de la base, vous pouvez utiliser Prisma Studio :

```bash
npx prisma studio
```

Cela ouvrira une interface web à l'adresse [http://localhost:5555](http://localhost:5555) où vous pourrez explorer et modifier les données.

## 📝 Consignes du test technique

Ce test technique comporte deux parties :

### Partie 1 : Analyse critique du code existant

Votre première tâche consiste à analyser le code existant du chatbot et à fournir une critique constructive. Nous vous demandons de :

1. Évaluer la qualité générale du code et son niveau (débutant, intermédiaire, avancé)
2. Identifier les forces et les faiblesses du projet
3. Proposer des améliorations concrètes si necessaires (architecture, performance, UX, accessibilité, etc.)
4. Expliquer comment vous implémenteriez ces améliorations

**Important** : Vous n'êtes pas obligé de refaire entièrement le chatbot. Vous pouvez modifier le code existant si vous le souhaitez pour illustrer vos propos, mais l'objectif principal est d'émettre un avis critique et constructif sur le projet.

### Partie 2 : Conceptualisation d'un système d'assistance à la construction de requêtes

Pour la deuxième partie, vous devrez conceptualiser et implémenter un système qui aide l'utilisateur à construire une requête structurée. 

**Important** : Votre système n'a pas à gérer les réponses du bot. Son objectif est uniquement de guider l'utilisateur dans la formulation d'un message le plus précis possible pour aider le backend (absent dans ce test) à bien comprendre les subtilités de la demande.

Vous devez ajouter à la base de donnée les tables suivantes.

```prisma
model Option {
  id          String @id @default(uuid())
  name        String @unique
  description String
}

model Location {
  id   String @id @default(uuid())
  name String @unique
  type String
}

model Item {
  id       String @id @default(uuid())
  name     String @unique
  category String
}
```

Les données de ces tables sont disponibles dans les fichiers CSV du dossier `data/` :
- `options.csv` : Les types de questions disponibles
- `locations.csv` : Les lieux disponibles
- `items.csv` : Les articles disponibles

Votre mission est de développer une interface qui guide l'utilisateur dans la construction d'une requête complète en l'aidant à sélectionner :
1. Une option de question
2. Un ou plusieurs lieu(x)
3. Un ou plusieurs item(s)

**Points importants à considérer :**
- Chaque option de question peut accepter un, plusieurs ou tous les types de lieux et d'items
- Certaines options ne nécessitent pas de lieu (comme `item_details`)
- Certaines options ne nécessitent pas d'item (comme `loc_details`)
- L'utilisateur peut vouloir filtrer par catégorie d'item ou par type de lieu
- L'utilisateur ne connaît pas à l'avance les valeurs disponibles dans ces tables, donc votre système doit l'accompagner pour formuler une requête qui utilise les termes exacts présents dans la base de données

**Contrainte importante** : Vous ne devez pas utiliser de modèles de langage (LLM) pour interpréter les messages de l'utilisateur ou générer des réponses.

**Outils autorisés** : Pour réaliser cette amélioration, l'utilisation d'outils d'IA (comme Cursor, GitHub Copilot, ChatGPT, etc.) est autorisée et même appréciée. Cependant, vous devrez démontrer une compréhension approfondie du code que vous produisez et expliquer clairement les décisions techniques que vous avez prises.

## 📤 Livraison attendue

Pour soumettre votre test, veuillez :

1. Forker ce repository
2. Implémenter vos modifications et améliorations
3. Ajouter un fichier `CRITIQUE.md` contenant votre analyse du code existant
4. Ajouter un fichier `SOLUTION.md` expliquant votre approche pour la partie 2
5. Nous envoyer le lien vers votre repository

## 🔎 Critères d'évaluation

Votre travail sera évalué sur :

- La pertinence et la profondeur de votre analyse critique
- La qualité et l'originalité de votre solution pour la partie 2
- La clarté de vos explications et la justification de vos choix techniques
- La qualité du code produit (lisibilité, maintenabilité, bonnes pratiques)
- Votre compréhension des concepts React, Next.js et Prisma

## ⏱️ Délai

Vous disposez de plusieurs jours pour réaliser ce test technique. La qualité est largement préférée à la quantité, donc prenez le temps nécessaire pour produire un travail dont vous êtes fier.

Bon courage !
