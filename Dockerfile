FROM ubuntu:17.10
ENV PATH /opt/miniconda3/bin:$PATH

RUN  apt-get update --fix-missing \
  && apt-get install -y software-properties-common python-software-properties apt-transport-https bzip2 ca-certificates curl git \
  && rm -rf /var/lib/apt/lists/*

RUN add-apt-repository ppa:pypa/ppa \
  && apt-get update \
  && apt-get install pipenv \
  && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN  apt-get update --fix-missing \
  && apt-get install -y nodejs yarn \
  && rm -rf /var/lib/apt/lists/*

RUN conda update --yes -n base conda \
  && conda clean --all --yes

ADD . /opt/app
WORKDIR /opt/app

RUN cd app \
  && yarn install \
  && yarn run build \
  && cd ..

RUN pipenv install

CMD ["./server.sh"]
