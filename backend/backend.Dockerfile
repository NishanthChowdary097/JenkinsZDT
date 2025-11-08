# ===========================
# Stage 1: Build environment
# ===========================
FROM python:3.10-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY /backend/todo/requirements.txt .

RUN pip install --user --no-cache-dir -r requirements.txt


# ===========================
# Stage 2: Runtime image
# ===========================
FROM python:3.10-slim

WORKDIR /app

COPY . .

COPY --from=builder /root/.local /root/.local

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

ENV FLASK_ENV=production

CMD ["python","-m","backend.todo.wsgi"]