# 💻 Claims Management System - Frontend

Este es el frontend del sistema de gestión de reclamos, desarrollado con **Next.js 13+**, **TypeScript**, **Tailwind CSS** y componentes reutilizables. Está conectado al backend mediante peticiones autenticadas con JWT.

---

## 🚀 Tecnologías utilizadas

- React / Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Axios
- JWT Auth (con LocalStorage)
- React Hook Form + Zod
- Lucide React Icons
- toast (`sonner`)

---

## 🧠 Funcionalidades principales

### 🎫 Cliente (`/client`)
- Registro e inicio de sesión.
- Crear reclamos con prioridad y tipo.
- Ver historial de reclamos.
- Ver estado: `PENDING`, `IN_PROCESS`, `RESOLVED`, `CLOSED`.

### 🧑‍💼 Agente (`/agent`)
- Inicia sesión y accede al dashboard.
- Visualiza todos los reclamos.
- Filtra por estado, prioridad y texto.
- Cambia estado de los reclamos usando botones o dropdown.
- Accede al detalle de cada reclamo.

---

## 🛠️ Inicialización del proyecto

### 1. Clona el repositorio

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura la URL del backend

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Ejecuta la app

```bash
npm run dev
```

Accede a [http://localhost:3000](http://localhost:3000)

---

## 🔐 Autenticación y seguridad

- El JWT se almacena en `localStorage` al iniciar sesión.
- Cada ruta está protegida por el componente `<ProtectedRoute />`, que valida el rol (`CLIENTE` o `AGENTE`).
- Las rutas se dividen en `/client/` y `/agent/`.

---

## 🧩 Componentes principales

| Carpeta                   | Descripción                                     |
|---------------------------|-------------------------------------------------|
| `components/claims/`      | Tarjetas, tablas y formularios de reclamos     |
| `components/layout/`      | Navbar, dashboard layout                        |
| `components/ui/`          | Botones, inputs, selects (usando shadcn/ui)    |
| `hooks/use-auth.ts`       | Hook de autenticación                          |
| `lib/api.ts`              | Lógica de conexión con el backend via Axios    |
| `contexts/auth-context.tsx` | Contexto global de autenticación             |

---

## 🧪 Funcionalidad de actualización de reclamos

- El componente de detalle del reclamo (`/agent/claims/[id]`) permite cambiar el estado mediante un selector o con botones rápidos.
- Los estados se sincronizan visualmente y muestran toasts personalizados si el backend devuelve errores.
- El sistema detecta errores como:
  - `El reclamo ya está resuelto`
  - `No se puede cerrar un reclamo pendiente`

---

## 📸 UI Moderna

- Diseño responsivo y accesible.
- Animaciones suaves con Tailwind y clases dinámicas.
- Visualización clara de prioridad y estado con colores e íconos.

---

## 📩 Contacto

Este frontend fue creado para fines educativos y puede adaptarse fácilmente a otros contextos.

> Autor: Jose Luis Burbano Buchelly
> Contacto: jose.burbanob@campusucc.edu.co
