# Conception de l'application

## Analyse des entités

### Les entités

- User
  - id
  - first_name
  - last_name
  - email
  - password
- Table
  - id
  - name
  - background_color
- List
  - id
  - name
  - position
- Card
  - id
  - name
  - position
  - background_color
  - text_color
- Tag
  - id
  - name
  - background_color
  - text_color

## Analyse des relations

### User <--> Table

Un User est le créateur des Tables.

- Verbe : construire
- Cardinalité :
  - User > Table : un utilisateur peut construire au minimum 0 et au maximum N tableau(x)
  - Table > User : un tableau peut être construit par au minimum 1 et au maximum 1 utilisateur
- Relation de type : 1:N

### User <--> List

Un User est le créateur des Lists.

- Verbe : créer
- Cardinalité :
  - User > List : un utilisateur peut créer au minimum 0 et au maximum N liste(s)
  - Lists > User : une liste peut être créée par au minimum 1 et au maximum par 1 utilisateur
- Relation de type : 1:N

### User <--> Card

Un User est le créateur des Cards.

- Verbe : concevoir
- Cardinalité :
  - User > Card : un utilisateur peut concevoir au minimum 0 et au maximum N carte(s)
  - Card > User : une carte peut être conçue par au minimum 1 et au maximum par 1 utilisateur
- Relation de type : 1:N

### User <--> Tag

Un User est le créateur des Tags.

- Verbe : élaborer
- Cardinalité:
  - User > Tag : un utilisateur peut élaborer au minimum 0 et au maximum N tag(s)
  - Tag > User : un tag peut être élaboré par au minimum 1 et au maximum 1 utilisateur
- Relation de type : 1:N

### Table <--> List

Les Tables contiennent des Lists.

- Verbe : renfermer
- Cardinalité :
  - Table > List : un tableau renferme au minimum 0 et au maximum N liste(s)
  - List > Table : une liste peut être renfermée par au minimum 1 et au maximum 1 tableau
- Relation de type: 1:N

### List <--> Card

Les Lists contiennent des Cards.

- Verbe : contenir
- Cardinalité :
  - List > Card : une liste contient au minimum 0 et au maximum N carte(s)
  - Card > List : une carte peut être contenue par au minimum 1 et au maximum 1 liste
- Relation de type : 1:N

### Card <--> Tag

Les Cards contiennent des Tags

- Verbe : définir
- Cardinalité :
  - Card > Tag : une carte peut être définie par au minimum 0 et au maximum N tag(s)
  - Tag > Card : un tag peut définir au minimum 0 et au maximum N carte(s)
- Relation de type : N:N

## MCD sur MOCODO

```text
Définir, 0N Card, 0N Tag
Card: id, name, position, background_color, text_color
Contenir, 0N List, 11 Card
List: id, name, position

Tag: id , name, background_color, text_color
Concevoir, 0N User, 11 Card
Créer, 0N User, 11 List
Renfermer, 0N Table, 11 List

Elaborer, 0N User, 11 Tag
User: id, first_name, last_name, email, password
Construire, 0N User, 11 Table
Table: id, name, background_color
```
