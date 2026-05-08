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

### Local PostgreSQL Setup (Windows)

1. Install PostgreSQL for Windows (default port `5432`).
2. Open `SQL Shell (psql)` as `postgres` superuser.
3. Run:

```sql
CREATE USER odilo WITH PASSWORD 'odilo';
CREATE DATABASE odilo_tech_challenge OWNER odilo;
GRANT ALL PRIVILEGES ON DATABASE odilo_tech_challenge TO odilo;
```

### Maven Setup (Windows)

1. Download `apache-maven-3.9.15-bin.zip` from Apache Maven archives.
2. Extract it to `C:\Tools\apache-maven-3.9.15`.
3. Set environment variables:
   - `MAVEN_HOME=C:\Tools\apache-maven-3.9.15`
   - Add `%MAVEN_HOME%\bin` to `Path`
4. Open a new terminal and verify:

```bash
mvn -v
```

### Run Backend with Local Profile

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Health check:

```text
http://localhost:8080/actuator/health
```

## Frontend

Location: `frontend/`

- Angular 19

Run frontend:

```bash
cd frontend
npm start
```
