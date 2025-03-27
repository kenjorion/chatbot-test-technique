# Choix de la structure et de la solution 

Etant donné que la contruction d'une requête doit être codé de manière compréhensible pour le développeur et doit être simple et efficace pour l'utilisateur, j'ai opté pour une structure simple et centralisée. Au lieu de décomposer les étapes en plusieurs composants correspondant à Option, Location et Item, j'ai choisi de les inclure dans un même fichier. A l'avenir évidemment, il faudrait les séparer si on ajoute d'autres étapes dans la requete structurée (ce qui peut alourdir l'experience utilisateur également...)

# Fonctionnalités  

- Choix entre un message "libre" et une requête structurée sur la page principale 
- Dans la requête, choix de l'option dans une liste déroulante
- Affichage des lieux et items dynamiquement à partir de la base de données en radio boutons et affichage des filtres 
- Selection multiple
- Envoi de la requête centralisée dans le chatbot

# Axes d'amélioration 

- Découpage du composant QueryBuilder en sous composant
- Séparer la logique dans un dossier intermédiaire pour tous les call API 
- Multilangues 
- Spinner et auto-completion pour le ChatInput basé sur les données en base
- dark mode

