# 🧾 Claims Management System

Sistema completo de gestión de reclamos con roles diferenciados (CLIENTE y AGENTE), construido con una arquitectura desacoplada frontend-backend.

---

## 📁 Repositorio

Este sistema está alojado en el siguiente repositorio (estructura no estándar pero funcional):
https://github.com/Jacklb19/ClaimsSystem.git

🔗
```
ClaimsSystem/
├── Claims/      ← Backend (Spring Boot + MongoDB)
├── Front/       ← Frontend (Next.js + Tailwind + JWT)
```

---

## 🧠 Funcionalidad general

### 👤 Cliente
- Registro e inicio de sesión.
- Crear reclamos con prioridad y tipo.
- Ver y filtrar sus propios reclamos.
- Ver estado del reclamo (`PENDING`, `IN_PROCESS`, `RESOLVED`, `CLOSED`).

### 🧑‍💼 Agente
- Iniciar sesión como agente.
- Ver todos los reclamos del sistema.
- Filtrar por estado, prioridad y texto.
- Cambiar el estado de un reclamo paso a paso o con acciones rápidas.
- Ver detalle y cerrar reclamos.

---

## 🧩 Arquitectura general

| Capa        | Tecnología                        | Descripción |
|-------------|-----------------------------------|-------------|
| Frontend    | Next.js 13+, React, Tailwind      | UI moderna y responsiva |
| Backend     | Spring Boot, MongoDB              | API REST segura con JWT |
| Seguridad   | JWT + Roles                       | Protege rutas y operaciones según usuario |
| Lógica      | Patrón State                      | Controla la transición entre estados del reclamo |
| Persistencia| MongoDB                           | Almacena usuarios y reclamos |

---

## 🔐 Seguridad

- El login genera un JWT que se guarda en `localStorage`.
- Las rutas del frontend están protegidas por rol (`CLIENTE`, `AGENTE`).
- El backend verifica permisos en cada endpoint.

---

## 🛠️ Instalación rápida

### 🔁 Clonar el proyecto

```bash
git clone https://github.com/Jacklb19/ClaimsSystem.git
cd ClaimsSystem
```

### 🖥️ Backend

```bash
cd Claims
mvn spring-boot:run
```

> Asegúrate de tener MongoDB ejecutándose en `localhost:27017`

### 💻 Frontend

```bash
cd Front
npm install
npm run dev
```

---

## 🧪 Flujo de reclamos

```
Cliente crea reclamo (PENDING)
       ↓
Agente lo pone EN PROCESO
       ↓
Agente lo marca como RESUELTO
       ↓
Agente lo CIERRA (CLOSED)
```

Estados y transiciones se controlan con clases de `ClaimState`.

---

## 📬 Contacto

Este proyecto fue desarrollado con fines académicos.  
Puedes adaptarlo a sistemas de tickets, soporte técnico, PQRS, etc.

> Autor: Jose Luis Burbano Buchelly
> Contacto: jose.burbanob@campusucc.edu.co

---
