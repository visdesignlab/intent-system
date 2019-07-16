FROM ubuntu:16.04
ENV PATH /opt/miniconda3/bin:$PATH

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN  apt-get update --fix-missing \
  && apt-get install -y wget bzip2 ca-certificates curl git yarn \
  && rm -rf /var/lib/apt/lists/*

RUN  wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh \
  && chmod +x miniconda.sh \
  && ./miniconda.sh -b -p /opt/miniconda3 \
  && rm miniconda.sh

RUN conda update --yes -n base conda \
  && conda clean --all --yes

ADD . /opt/app
WORKDIR /opt/app

RUN conda env create -f environment.yml

CMD ["./server.sh"]
