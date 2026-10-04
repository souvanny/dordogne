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
| Frontend (Angular dev) | http://localhost:8185 |
| API | http://localhost:8085/api |
| Healthcheck | http://localhost:8085/api/health |
| phpMyAdmin | http://localhost:8285 |

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

## Structure

```
dordogne/
├── symfony-app/            # API Symfony
├── frontend/               # Angular
├── docker/
│   ├── php/                # PHP-FPM + Composer
│   └── node/               # Dockerfile dev Angular
├── nginx/                  # Config Nginx de l'API
├── docker-compose.yml
├── .env                    # Variables (ports, DB, secrets)
└── Makefile
```

## Ports

| Service | Port |
|---------|------|
| Nginx (API) | 8085 |
| Frontend | 8185 |
| phpMyAdmin | 8285 |
| MySQL | 3385 |
