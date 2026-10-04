# Dordogne

Base technique du projet Dordogne : API Symfony + frontend Angular + base MySQL, le tout orchestré par Docker.

- **Frontend** : Angular 22 — `frontend/`
- **API** : Symfony 8.1 — `symfony-app/`
- **Base de données** : MySQL 8.4
- **Infra** : Docker (compose)

## Prérequis

- Docker & Docker Compose
- Make (optionnel)

## Démarrage local

```bash
make up
```

Au premier démarrage, les conteneurs sont construits puis les dépendances sont installées (composer / npm).

| Service | URL |
|---------|-----|
| Frontend (Angular dev) | http://localhost:8186 |
| API | http://localhost:8086/api |
| Healthcheck | http://localhost:8086/api/health |
| phpMyAdmin | http://localhost:8286 |

Le front proxifie `/api` vers l'API (voir `frontend/proxy.conf.json`).

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `make up` | Démarre tous les services |
| `make down` | Arrête et supprime les conteneurs |
| `make logs` | Logs en direct |
| `make ps` | État des conteneurs |
| `make bash` | Shell dans le conteneur PHP |
| `make bash-front` | Shell dans le conteneur frontend |
| `make console ARGS="..."` | `bin/console` Symfony |
| `make composer ARGS="..."` | Composer dans le conteneur |
| `make migrate` | Migrations Doctrine |

## Les lieux & monuments (données)

Le contenu du site (châteaux, grottes, sites troglodytiques, nature) est
décrit en JSON dans `_docs/documents_01/` — un dossier par lieu, contenant un
`site.json` et éventuellement un dossier `img/`.

Le script `scripts/build-data.mjs` convertit ce dossier en `frontend/public/data/`
(`sites.json` + images), consommé directement par le frontend Angular (aucune
base de données).

```bash
make data      # régénère frontend/public/data depuis _docs/documents_01
```

### Ajouter un lieu

1. Créer un dossier `_docs/documents_01/<nom>/` avec un `site.json` :

```json
{
  "id": "mon-lieu",
  "name": "Mon lieu",
  "category": "chateau",
  "title": "Un sous-titre accrocheur",
  "description": ["Premier paragraphe.", "Second paragraphe."],
  "url": "https://exemple.fr/",
  "images": ["img/photo.webp"]
}
```

2. Ajouter les images dans `_docs/documents_01/<nom>/img/` (optionnel).
3. Lancer `make data` puis `make up`.

Catégories disponibles : `chateau`, `grotte`, `troglodyte`, `nature`.

## Structure

```
dordogne/
├── symfony-app/            # API Symfony
├── frontend/               # Angular
├── docker/
│   ├── php/                # PHP-FPM + Composer
│   └── node/               # Dockerfile dev Angular
├── nginx/                  # Config Nginx de l'API
├── scripts/                # Scripts (build-data.mjs)
├── _docs/documents_01/     # Contenu des lieux (JSON + images)
├── docker-compose.yml
├── .env                    # Variables (ports, DB, secrets)
└── Makefile
```

## Ports

| Service | Port |
|---------|------|
| Nginx (API) | 8086 |
| Frontend | 8186 |
| phpMyAdmin | 8286 |
| MySQL | 3386 |
