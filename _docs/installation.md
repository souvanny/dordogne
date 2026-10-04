# Installation & lancement

## Prérequis

- Docker & Docker Compose
- Make (optionnel, permet de raccourcir les commandes)
- Node.js 24+ (uniquement pour lancer le front hors Docker, voir ci-dessous)

## Variables d'environnement

Toute la configuration (nom de projet, ports, identifiants MySQL, URLs) est
centralisée dans le fichier `.env` à la racine. Il est lu à la fois par le
`Makefile` et par `docker compose --env-file=./.env`.

| Service | Port local |
|---------|-----------|
| API (nginx) | 8086 |
| Frontend | 8186 |
| phpMyAdmin | 8286 |
| MySQL | 3386 |

---

## 1. Lancement local — tout en Docker (recommandé)

Toute la stack (API, MySQL, phpMyAdmin, frontend dev) tourne dans des conteneurs.

```bash
make build     # construit les images (php + node) — à refaire si les Dockerfiles changent
make up        # démarre tous les conteneurs en arrière-plan
```

Équivalent sans `make` :

```bash
docker compose --env-file=./.env -f docker-compose.yml -p dordogne up -d --build --remove-orphans
```

Au premier démarrage, le conteneur PHP exécute `composer install` si `vendor/`
est absent, et le conteneur frontend exécute `npm install && npm start`
(dev server Angular avec watch).

| Service | URL |
|---------|-----|
| Frontend (Angular dev) | http://localhost:8186 |
| API | http://localhost:8086/api |
| Healthcheck | http://localhost:8086/api/health |
| phpMyAdmin | http://localhost:8286 |

Le front proxifie `/api` vers le conteneur `nginx_api` (voir `frontend/proxy.conf.json`).

Commandes utiles :

```bash
make ps          # état des conteneurs
make logs        # logs en direct
make down        # arrête et supprime les conteneurs
make bash        # shell dans le conteneur PHP
make console ARGS="..."   # bin/console Symfony
make migrate     # migrations Doctrine
```

---

## 2. Lancement local — front sur le host (hors Docker)

L'API reste dans Docker, mais le dev server Angular tourne directement sur la
machine (pratique pour le hot reload et le debug du front).

1. Lancer l'API en Docker (le front Docker peut être arrêté) :

```bash
make up
```

2. Installer les dépendances du front sur le host :

```bash
cd frontend
npm install
```

3. Lancer le dev server avec le proxy pointant vers l'API du host :

```bash
npm run start:local
```

`start:local` utilise `proxy.local.json`, qui redirige `/api` vers
`http://localhost:8086` (l'API exposée par Docker). Le front est alors
accessible sur http://localhost:4200.

> `npm run start` (sans `:local`) utilise `proxy.conf.json`, qui cible
> `http://nginx_api:80` et ne fonctionne que **à l'intérieur** du réseau Docker.

---

## 3. Production

En production, le frontend est buildé (`ng build --configuration=production`)
puis servi par Nginx dans une image dédiée. L'API tourne avec `APP_ENV=prod`.

```bash
make prod-build        # construit les images (dont le front de production)
make prod-up           # démarre la stack de production
make prod-logs         # logs en direct
make prod-down         # arrête et supprime les conteneurs
```

Équivalent sans `make` :

```bash
docker compose --env-file=./.env -f docker-compose.prod.yml -p dordogne up -d --build --remove-orphans
```

Au démarrage du conteneur PHP en prod, l'entrypoint exécute les migrations
(`doctrine:migrations:migrate`) puis un `cache:clear`.

Commandes utiles :

```bash
make prod-bash                 # shell dans le conteneur PHP prod
make prod-console ARGS="..."   # bin/console Symfony prod
```

### Redéploiement

```bash
make prod-build
make prod-down && make prod-up
```
