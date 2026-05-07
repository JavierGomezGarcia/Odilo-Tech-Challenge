# Odilo Tech Challenge

Monorepo with separate frontend and backend applications.

## Structure

```text
.
|-- frontend/   (Angular 19)
`-- backend/    (Spring Boot + PostgreSQL)
```

## Backend

Location: `backend/`

- Java 21
- Spring Boot 3.5.12
- Maven
- Spring Web, Data JPA, Validation, Actuator
- PostgreSQL

Start database from repo root:

```bash
docker compose -f backend/docker-compose.yml up -d
```

Run backend:

```bash
cd backend
mvn spring-boot:run
```

## Frontend

Location: `frontend/`

- Angular 19

Run frontend:

```bash
cd frontend
npm start
```
