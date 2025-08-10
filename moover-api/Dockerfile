FROM ruby:3.1.3

# Instalación de dependencias del sistema
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client curl

# Carpeta de la app
WORKDIR /app

# Copia los archivos de Rails
COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

# Entrypoint personalizado
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
