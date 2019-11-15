FROM ubuntu:20.04

RUN  apt-get update --fix-missing \
  && apt-get install -y apt-transport-https pipenv nodejs bzip2 ca-certificates curl git \
  && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN  apt-get update --fix-missing \
  && apt-get install -y yarn \
  && rm -rf /var/lib/apt/lists/*

ADD . /opt/app
WORKDIR /opt/app

RUN cd app \
  && yarn install \
  && yarn run build \
  && cd ..

CMD ["./server.sh"]
