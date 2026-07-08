# Sistema de Gestión de Arrendamiento

Aplicación web desarrollada con **React**, **TypeScript** y **Vite** para la administración integral de contratos de arrendamiento, propiedades, pagos y usuarios. El sistema cuenta con tres roles de acceso —administrador, arrendador e inquilino— cada uno con vistas y funcionalidades específicas adaptadas a sus necesidades.

## Descripción del Proyecto

Esta plataforma permite gestionar de manera centralizada todo el ciclo de vida de un arrendamiento:

- **Propiedades**: registro, edición y consulta de inmuebles con sus características, amenidades y estado de ocupación.
- **Contratos**: creación y seguimiento de contratos de arrendamiento con términos, fechas, renta mensual y depósito.
- **Pagos**: control de pagos de renta con estados (pendiente, pagado, vencido) e historial.
- **Usuarios**: administración de perfiles por rol (administrador, arrendador, inquilino).
- **Mensajes**: interfaz de conversaciones entre arrendadores e inquilinos.

El diseño de la interfaz está basado en componentes reutilizables con **Tailwind CSS** y utiliza un sistema de rutas protegidas según el rol del usuario autenticado.

## Estructura Básica

```
├── src/app/
│   ├── App.tsx                 # Punto de entrada de la aplicación
│   ├── router.tsx              # Configuración de rutas y navegación
│   ├── types/                  # Tipos unificados (User, Property, Contract, Payment)
│   ├── contexts/               # Contextos de React (autenticación)
│   ├── hooks/                  # Hooks personalizados (navegación por rol)
│   ├── components/
│   │   ├── admin/              # Vistas exclusivas del administrador
│   │   ├── arrendador/         # Vistas del arrendador
│   │   ├── inquilino/          # Vistas del inquilino
│   │   ├── shared/             # Componentes compartidos entre roles
│   │   ├── ui/                 # Componentes de interfaz reutilizables
│   │   ├── login.tsx           # Pantalla de inicio de sesión
│   │   └── layout.tsx          # Layout base de la aplicación
│   └── data/                   # Datos mock para desarrollo
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Tecnologías Principales

- [React](https://react.dev/) — biblioteca para construir interfaces de usuario
- [TypeScript](https://www.typescriptlang.org/) — tipado estático para JavaScript
- [Vite](https://vitejs.dev/) — herramienta de construcción y servidor de desarrollo
- [React Router](https://reactrouter.com/) — enrutamiento declarativo
- [Tailwind CSS](https://tailwindcss.com/) — utilidades para estilos rápidos
- [Lucide React](https://lucide.dev/) — iconografía
- [Radix UI](https://www.radix-ui.com/) — componentes primitivos accesibles
- [React Hook Form](https://react-hook-form.com/) — manejo de formularios

## Uso

### Requisitos Previos

- Node.js (versión LTS recomendada)
- npm

### Instalación de Dependencias

```bash
npm install
```

### Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación se ejecutará por defecto en `http://localhost:5173`.

### Comandos Disponibles

| Comando              | Descripción                                          |
|----------------------|------------------------------------------------------|
| `npm run dev`        | Inicia el servidor de desarrollo con Vite            |
| `npm run build`      | Genera la versión optimizada para producción         |
| `npm run type-check` | Verifica los tipos de TypeScript sin emitir archivos |
| `npm run lint`       | Ejecuta ESLint sobre el código fuente                |
| `npm run lint:fix`   | Corrige automáticamente los problemas detectados     |

### Acceso al Sistema

El proyecto incluye usuarios de prueba para facilitar el desarrollo:

| Rol           | Correo                   | Contraseña  |
|---------------|--------------------------|-------------|
| Administrador | `admin@example.com`      | `admin123`  |
| Arrendador    | `arrendador@example.com` | `landlord123` |
| Inquilino     | `inquilino@example.com`  | `tenant123` |

El diseño original de la interfaz está disponible en [Figma](https://www.figma.com/design/wXfXTt0GKhUPYHV9mApGrr/Sistema-de-gesti%C3%B3n-de-arrendamiento).
