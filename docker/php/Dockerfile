FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        bash \
        git \
        unzip \
        curl \
        wget \
        tar \
        icu-dev \
        libzip-dev \
        oniguruma-dev \
        mysql-client \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        mysqli \
        mbstring \
        intl \
        zip \
        opcache \
        bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini \
    && echo "upload_max_filesize=50M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=50M" >> /usr/local/etc/php/conf.d/uploads.ini

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www/html

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
