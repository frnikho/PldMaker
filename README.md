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

#### l'état du PLD

a la fin du PLD, il sera possible de le sauvegarder ou bien de le signé.
signé un PLD signifie qu'il a été verifier et qu'il ne serat plus modifiable dans le temps

### Features a faire en Build

- Créer un pld dans une organization, suivre son avancement et permettre la completion de différents champs (Dod, Description, Reste a faire)
- Generer un docx du pld, les dods séparement et suivre leur version dans le temps

### Features a faire en Run

- création d'un system de socket pour les notifications en temps réel, modification du même document, voir les members en ligne d'une organization, 
- avoir une roadmap permettant de savoir dans le temps ou se situe l'avancement des Dods
- permettre la duplication de Dod
- avoir une todo list partagé dans l'organization (pourquoi pas la linker aux issue de github ?)

## Installation

### Docker et Docker compose

prérequis: 
- installer docker et docker compose pour pouvoir lancer les commandes suivantes
- créer un fichier .env (prenez comme example le .env.example)

```shell
$ ~/PLD/ docker compose up
```

### NX 

prérequis:
- avoir une database NoSQL mongodb
- créer un fichier .env (prenez comme example le .env.example)
- installer NX:

```shell
$ ~/PLD/ sudo npm i -g nx
```

puis installer les dépendances via npm:

```shell
$ ~/PLD/ npm i
```

ou via pnpm

```shell
$ ~/PLD/ pnpm i 
```

```shell
$ ~/PLD/ nx build backend
$ ~/PLD/ nx build front
```

```shell
$ ~/PLD/ nx server backend
$ ~/PLD/ nx server front
```

```shell
$ ~/PLD/ nx test backend
$ ~/PLD/ nx test front
```
