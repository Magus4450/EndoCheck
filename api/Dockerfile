FROM python:3.10.10-alpine3.17

ENV PYTHONUNBUFFERED=1

WORKDIR /api

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
