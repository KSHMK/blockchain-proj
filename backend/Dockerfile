FROM python:3

WORKDIR /src

ADD ./src /src
VOLUME ./audio_data /src/audio_data
RUN pip install -r requirements.txt

CMD ["uwsgi","uwsgi.ini"]
