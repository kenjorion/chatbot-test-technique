# Points positifs : 

## La structure du code 

Elle est claire et bien avec des composants séparés et réutilisables 

## Pas de redondance

Les useCallbacks et memos évitent les recreations inutiles

## Bonne experience utilisateur 

Bonne pratique pour la gestion des chargements avec isTyping ou l’affichage temporaire 

## Gestion des états 

Bonne gestion des états dans les différents composants 

## Gestion des erreurs 

Bonne pratique avec l’utilisation des try and catch 

## README.md 

Fichier très clair et compréhensible


# Points négatifs : 

## Utilisation de variable globale 

Créer une variable globale ErrorMessage pour la gestion des erreurs, pour éviter d’écrire « en dur » dans le code. Cela permet d’être plus flexible dans le code, surtout si le projet change de langue ou s’agrandit

## Affichage des erreurs 

Actuellement les erreurs sont affichées dans la console, ce serait pratique d’émettre une alerte ou un message sous le champ (input) dans l’interface

## Mauvaise utilisation de l’ID 

L’utilisation de Date.now().toString() pour générer un id temporaire, ce qui n'est pas optimal car :
* Cela peut créer des IDs en double si plusieurs messages sont envoyés rapidement (presque)
* Ce n’est pas un UUID valide.
Une librairie comme uuid est efficace pour ce cas.

## Utilisation excessive des memos

Les memos sont utilisées parfois de manière inappropriées

## Refactoring potentiel 

Si la logique de gestion des appels API devient plus complexe, nous pourrions envisager de créer des fonctions utilitaires séparées pour ces appels afin de garder les composants propres et concentrés sur la gestion de l'état et de l'interface utilisateur.

Un hook personnalisé pour gérer la logique de communication avec l'API si elle est réutilisée ailleurs pourrait être envisageable

## Optimisation de la gestion des événements (handleSubmit et handleKeyDown)

Actuellement, handleSubmit et handleKeyDown répètent presque la même logique pour envoyer le message.
Créer une fonction sendMessage() et la réeutiliser dans les deux handlers seraient favorables

## Amélioration de l’expérience utilisateur sur mobile

Quand l’utilisateur tape un message sur mobile, le clavier peut cacher souvent l’input, et il n'y a pas de gestion spécifique pour ça.
Il faudrait ajouter un scrollIntoView() pour que l’input reste visible

# Conclusion : 

Le code est de niveau intermédiaire/avancé

