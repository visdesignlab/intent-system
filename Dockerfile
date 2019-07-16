FROM ubuntu:16.04
ENV PATH /opt/miniconda3/bin:$PATH

RUN  apt-get update --fix-missing \
  && apt-get install -y apt-transport-https wget bzip2 ca-certificates curl git \
  && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN  apt-get update --fix-missing \
  && apt-get install -y nodejs yarn \
  && rm -rf /var/lib/apt/lists/*

RUN  wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh \
  && chmod +x miniconda.sh \
  && ./miniconda.sh -b -p /opt/miniconda3 \
  && rm miniconda.sh

RUN conda update --yes -n base conda \
  && conda clean --all --yes

ADD . /opt/app
WORKDIR /opt/app

RUN cd app \
  && yarn install \
  && yarn run build \
  && cd ..

RUN conda env create -f environment.yml

CMD ["./server.sh"]
