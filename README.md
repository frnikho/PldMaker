# PLD

### Epitech EIP PLD Maker

### description

le but de ce projet est de simplifier le suivi et la création de PLD avec son équipe. la création du PLD se fera via une interface web ou l'utilisateur devras se connecter afin de pouvoir retrouver son organisation.

l'organisation est la piece maitresse du projet, elle reflette les members d'un projet, les séquences disponibles (sprints, kickoff...), les différents template de PLD, de DoD, de "documents"

chaque PLD contient les informations suivantes:
- un nouveau numéro de version (auto incrémentable)
- un nom
- une nouvelle description
- des auteurs
- un template "description du document"
- un tableau des révisions (maj du PLD)
- un sommaire (TBD)
- de documents
- la charte couleurs des avancements disponibles des US
- les différents DoD
- un rapport d'avancement
- l'état du PLD

le but finale du projet est d'avoir la génération d'un docx et d'un pdf.

### Description de chaque "séquence d'un PLD"

#### Numéro de version

le numéero de version du pld sera auto générer ou mit manuellement. pour que le numéro de version soit générer automatiquement, il faudrat au préhalable configurer le champ "pld version shifting" dans votre organisations.

#### Le Nom

le nom de votre PLD sera par défault vide, le nom de la derniére révision apparaitra en hint sur le champ 


#### La Description

la description de votre PLD remprendra par défault la description du dérnier PLD


#### Les Auteurs

Il existerat trois choit possible:
- utiliser les auteurs de l'organisations
- reprendre les utilisateur présent lors du dérnier PLD
- les ajouters manuellement

dans notre cas, l'utilisation la plus fréquente serat d'utiliser les auteurs de l'organisations.

#### Description du document

cette section sera amovible par l'utilisateur, par définition, il serat possible de créer des champs avec des valeurs dites "placeholders". le but est de créer un template qui sera réutilisable dans le temps avec la valeurs des champs qui se mettent a jours automatiquement sans avoir a aller sur le document.

#### Tableau des révisions

Le tableau des révisions var récuperer les anciennes versions du PLD pour les mettres a la suites 

#### Front
Techno: React
Lib UI: https://carbondesignsystem.com/

#### Backend
Techno: Nest JS


# Installation

## Configuration

Avant de commencer, que ça soit pour docker ou bien le build en manuel, il faut créer un fichier .env à la racine du repo. Des fichiers d'exemple commencent par '.env' sont présent pour vous guider.

```shell
# ce fichier est pré rempli pour avoir un environnement prés a l'emploi avec Docker
.env.docker.example
# celui-ci est conseillé quand vous devez déployer/construire votre application en mode développement
.env.example
```

## Installation / Deployment via Docker

Le repo contient un fichier [Docker Compose](https://docs.docker.com/compose/) qui comprend 3 services :

 - Une database MongoDB ()
 - Un app front sous react 
 - Une api nestjs

Vous pouvez par la suite rajoutez d'autres services comme mongo-express pour visualiser votre db.

```shell 
# pour lancer tout les services
$ docker compose up -d
# si vous souaitez seulement lancer la db pour pouvoir dev en local, vous pouvez lancer le service mongo a pars
$ docker compose up -d mongo
```

## Installation Manuel

Pour commencer a build/dev vous devez cloner le repo:

```shell
$ git clone git@github.com:OutsideEIP/PLD.git
# ou
$ git clone https://github.com/OutsideEIP/PLD.git
```


Le repo a été configurer en mode Monorepo grace a [NX](https://nx.dev/), il vous faut donc installer nx en local pour pouvoir build ou dev l'app:

```shell
$ npm i -g nx
# ou avec sudo
$ sudo npm i -g nx
```

et par la suite, vous pouvez installer les dépendences nécéssaire aux apps:

```shell
# le -f va forcer l'installation de dépendances qui ne sont pas compatibles entre elles (pas de panique 🙂)
$ npm -f i
```

Une fois cette étape fini, vous pourrez lancer les applications solo:

```shell
# Pour le front 
$ nx serve front
# et pour le back
$ nx serve backend
```

#### Tips 💡 
L'idéal quand vous devez développer sur le front ou le back est de lancer la db via le docker compose et de lancer les apps manuellement comme ci-dessus.

### Build

A la racine:
```shell
$ nx build backend
$ nx build front
```

Un dossier dist a été créer avec votre app front en static et votre api.
vous pouvez par la suite lancer vos apps en mode prod:

```shell

$ serve dist/apps/front
$ node dist/apps/backend
```
