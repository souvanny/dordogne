#!/bin/sh
set -e

cd /var/www/html

mkdir -p var/cache var/log
chown -R www-data:www-data var/cache var/log

if [ ! -d vendor ]; then
    echo "[entrypoint] vendor/ absent -> composer install"
    composer install --no-interaction --prefer-dist --no-progress
fi

if [ "$APP_ENV" = "prod" ] && [ "$SKIP_STARTUP_TASKS" != "1" ]; then
    echo "[entrypoint] migrations"
    php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

    echo "[entrypoint] cache:clear (prod)"
    php bin/console cache:clear --no-debug
fi

exec "$@"
