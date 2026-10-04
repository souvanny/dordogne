##################
# Variables
##################

include .env

COMPOSE_FILE ?= docker-compose.yml
COMPOSE_FILE_PROD ?= docker-compose.prod.yml

DOCKER_COMPOSE = docker compose --env-file=./.env -f ./$(COMPOSE_FILE) -p ${PROJECT_NAME}
DOCKER_COMPOSE_PROD = docker compose --env-file=./.env -f ./$(COMPOSE_FILE_PROD) -p ${PROJECT_NAME}

PHP_FPM = php

##################
# Local
##################

build:
	${DOCKER_COMPOSE} build

up:
	${DOCKER_COMPOSE} up -d --remove-orphans

rebuild:
	${DOCKER_COMPOSE} up -d --build --force-recreate --remove-orphans

down:
	${DOCKER_COMPOSE} down

stop:
	${DOCKER_COMPOSE} stop

start:
	${DOCKER_COMPOSE} start

logs:
	${DOCKER_COMPOSE} logs -f

ps:
	${DOCKER_COMPOSE} ps

##################
# Symfony
##################

bash:
	${DOCKER_COMPOSE} exec ${PHP_FPM} bash

console:
	${DOCKER_COMPOSE} exec ${PHP_FPM} php bin/console $(ARGS)

composer:
	${DOCKER_COMPOSE} exec ${PHP_FPM} composer $(ARGS)

migrate:
	${DOCKER_COMPOSE} exec ${PHP_FPM} php bin/console doctrine:migrations:migrate --no-interaction

##################
# Frontend
##################

bash-front:
	${DOCKER_COMPOSE} exec frontend bash

##################
# Production
##################

prod-build:
	${DOCKER_COMPOSE_PROD} build

prod-up:
	${DOCKER_COMPOSE_PROD} up -d --remove-orphans

prod-down:
	${DOCKER_COMPOSE_PROD} down

prod-logs:
	${DOCKER_COMPOSE_PROD} logs -f

prod-console:
	${DOCKER_COMPOSE_PROD} exec ${PHP_FPM} php bin/console $(ARGS)

prod-bash:
	${DOCKER_COMPOSE_PROD} exec ${PHP_FPM} bash
