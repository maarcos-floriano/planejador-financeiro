FROM mysql

WORKDIR /app

ENV MYSQL_ROOT_PASSWORD=senhaRoot
ENV MYSQL_DATABASE=planilha_sptech
ENV MYSQL_USER=ze
ENV MYSQL_PASSWORD=senhaDoZe

COPY init.sql /docker-entrypoint-initdb.d/
