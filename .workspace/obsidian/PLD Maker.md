### To Do:

- [x] Système de planification de réu (voir réu w/ Victor le 17/10 à 18h30)
- [ ] Rework de tout les composants pour passer en function component
    - [x] Modals
    - [ ] Page
    - [ ] Components
    - [ ] Utils
    - [x] Contexts
- [x] Test de la génération des documents word sur Windows et MacOS
    - [x] Microsoft word sous windows
    - [x] Microsoft word sous MacOS
- [x] Rework de la modal de création des DoDs
     - [x] Gestion d'erreur de chaque input
     - [x] Rework en fonctional component
- [ ] Build du système d'imports/exports des DoDs
- [ ] Maj du système d'affichage des modals concernant les historique des DoDs, Org et PLD
- [ ] Création d'un systéme tierce pour stoquer les images uploadé par les utilisateurs
- [ ] Terminer le fichier de traduction par défaut pour le front
- [ ] Mettre à jour le système des templates pour rendre tout dynamique
- [ ] Création du système de dépendences (w/ Luann)
- [ ] rework du système de domaine
- [ ] Ajout de l'effet shimmer lors du chargement des données sur le front
- [ ] ajout de + de placeholder, ajouter aussi des wrappers de style (bold, italic...)
- [x] créer un système de changelog
 
---

#### 17/10/2022

- Point avec Victor sur le système de planification des réunions

*Système a la framadate mais par semaine et non par events ?*

Système bon, revoir le systéme pour selectionner les dates:
- choisir la timezone de l'event (par défaut celui de l'utilisateur)
- un system de date picker pour selectionner la deadline
- choisir une heure de début, une heure de fin et un shifting entre les deux
- créer les choix de séléction automatiquement


Conclusion:

Prévoir un calendrier personnel sur ses disponibilité avec un preset applicable sur la durée*
Un utilisateur qui souhaite créer un event aura la possibilité de récuperer les calendriers de chaque user présent dans l'organisation pour voir les disponibilité et choisir le meilleur créneaux possible


### 18/10/2022

- Avancement dans le rework des components
- Idée pour save les assets lors du rebuild de l'api:
  mettre un path différent pour save les assets


### 19/10/2022

- Fix du probléme d'ouverture du documents WORD sous windows (a voir pour MacOS)
- bug sur Google Docs (non prise en charge de la taille des cellules du tableau en pourcentage, non prise en charge des fonts, taille de text et marges)
  solution provisoire: ouvrir le doc avec microsoft word, libreoffice... Sauvegarder le fichier et l'upload sur google drive pour avoir la mise en page correcte.
- Ajout de l'effet shimmer pour les composants du PLD



### 20/10/2022

- rework de components, ajout de la modification des tags sur la page d'un PLD