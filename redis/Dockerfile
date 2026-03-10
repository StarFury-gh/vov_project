FROM redis:8

# настройки пользователей
COPY redis-users.acl /usr/local/etc/redis/redis-users.acl

# конфиг
COPY redis.conf /usr/local/etc/redis/redis.conf

# директории для данных
RUN mkdir -p /data && chown redis:redis /data

EXPOSE 6379

# запуск
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]