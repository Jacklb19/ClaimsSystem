# 📬 Claims Management System - Backend

Este es el backend de un sistema de gestión de reclamos desarrollado en **Java + Spring Boot**, con autenticación basada en **JWT**, control de acceso por roles (**CLIENTE** y **AGENTE**), gestión de estado con el patrón **State**, y control de errores con mensajes claros para el frontend.

## 🚀 Tecnologías utilizadas

- Java 21+
- Spring Boot
- Spring Security
- MongoDB (Spring Data MongoDB)
- MapStruct
- JWT
- Lombok

## 📦 Estructura del proyecto

```
src/
├── config/                 → Seguridad y configuración de JWT
├── controller/             → Controladores REST (Auth, Claims)
├── dto/                    → Data Transfer Objects
├── mapper/                 → MapStruct mappers
├── model/                  → Entidades y enums
├── repository/            → Repositorios Mongo
├── service/                → Lógica de negocio
├── state/                  → Estados (Pending, Resolved, Closed, etc.)
├── exception/              → Manejador global de errores
```

## 🔐 Roles del sistema

- **CLIENTE**: puede crear reclamos, ver sus propios reclamos.
- **AGENTE**: puede ver todos los reclamos, cambiar sus estados (`PENDING` → `IN_PROCESS` → `RESOLVED` → `CLOSED`).

## 🧪 Endpoints principales

### 🔑 Autenticación
| Método | Ruta               | Descripción                    |
|--------|--------------------|--------------------------------|
| POST   | `/auth/login`      | Login de cliente o agente      |
| POST   | `/auth/register`   | Registro de cliente            |

### 📨 Gestión de reclamos (`/claims`)

| Método | Ruta                     | Rol      | Descripción                              |
|--------|--------------------------|----------|------------------------------------------|
| POST   | `/claims`                | CLIENTE  | Crear un reclamo                         |
| GET    | `/claims`                | Ambos    | Cliente ve sus reclamos, agente ve todos |
| GET    | `/claims/{id}`           | Ambos    | Ver detalle (con validación de acceso)   |
| PUT    | `/claims/{id}`           | AGENTE   | Actualizar estado del reclamo            |
| PUT    | `/claims/{id}/resolve`   | AGENTE   | Marcar reclamo como resuelto             |
| PUT    | `/claims/{id}/close`     | AGENTE   | Cerrar reclamo                           |

## 🛠️ Inicialización del proyecto

### 1. Clona el repositorio

### 2. Configura el archivo `.env` (opcional si no usas uno)

Asegúrate de tener las variables necesarias para MongoDB y JWT.

### 3. Ejecuta la aplicación

```bash
./mvnw spring-boot:run
```

o con Maven instalado:

```bash
mvn spring-boot:run
```

### 4. Base de datos

El proyecto usa un cluster de **MongoDB**. 

## 🧠 Lógica de estados (Patrón State)

Cada reclamo se encuentra en un estado:

- `PENDING` → `IN_PROCESS` → `RESOLVED` → `CLOSED`

Estos estados se controlan usando clases como:

- `PendingState`
- `InProcessState`
- `ResolvedState`
- `ClosedState`

Cada clase implementa la interfaz `ClaimState` y define qué acciones están permitidas.

## ❗ Control de errores

Los errores lógicos (como intentar resolver un reclamo cerrado) lanzan `ResponseStatusException`, y son manejados globalmente para devolver un JSON del tipo:

```json
{
  "message": "Este reclamo ya está cerrado"
}
```

Esto permite que el frontend muestre mensajes claros y contextualizados.

## 🔐 Seguridad

- JWT se genera al hacer login y se incluye en las peticiones autenticadas.
- Spring Security valida roles (`ROLE_CLIENTE`, `ROLE_AGENTE`) antes de permitir el acceso a los endpoints protegidos.

## ✅ Ejemplo de login

**Request:**

```json
POST /auth/login
{
  "username": "cliente1",
  "password": "123456"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "cliente1",
    "role": "CLIENTE"
  }
}
```

## 📩 Contacto

Este proyecto fue desarrollado con fines educativos y puede adaptarse a múltiples contextos.

> Autor: Jose Luis Burbano Buchelly
> Contacto: jose.burbanob@campusucc.edu.co
