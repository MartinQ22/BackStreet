# 🛍️ BACKSTREET E-COMMERCE API

Proyecto Backend desarrollado con **Node.js y Express** que simula un sistema de gestión de productos y carritos de compra. Utiliza **MongoDB Atlas** para la persistencia de datos y **Socket.IO** para la interacción en tiempo real (funcion omitida).

En este proyecto puedes visualizar la página y el dashboard usando Handlebars.

---

## 🚀 Funcionalidades Principales

Esta API implementa todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de productos y carritos:

### 📦 Gestión de Productos (`/api/products`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **`GET`** | `/api/products` | Obtiene la lista completa de productos (con paginación). |
| **`GET`** | `/api/products/:pid` | Obtiene un producto específico por su ID. |
| **`POST`** | `/api/products` | **Crea un nuevo producto** y lo guarda en la base de datos. |
| **`PUT`** | `/api/products/:pid` | **Modifica** uno o varios campos de un producto existente. |
| **`DELETE`** | `/api/products/:pid` | **Elimina** un producto específico por su ID. |

### 🛒 Gestión de Carritos (`/api/carts`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **`POST`** | `/api/carts` | **Crea un nuevo carrito vacío.** |
| **`GET`** | `/api/carts/:cid` | Obtiene el contenido (productos) de un carrito por su ID. |
| **`POST`** | `/api/carts/:cid/products/:pid` | Agrega un producto al carrito. Si el producto existe, **incrementa su `quantity`.** |
| **`DELETE`** | `/api/carts/:cid/products/:pid` | **Elimina un producto específico** por completo del carrito (sin importar su cantidad). |
| **`DELETE`** | `/api/carts/:cid` | **Elimina el carrito completo** por su ID. |

---

## 💻 Tecnologías y Dependencias

El proyecto está construido con la siguiente stack tecnológica:

| Tipo | Tecnología | Uso Principal |
| :--- | :--- | :--- |
| **Backend** | **Node.js & Express** | Servidor y enrutamiento de la API. |
| **Base de Datos** | **Mongoose** (con MongoDB Atlas) | Modelado de datos y conexión a la base de datos en la nube. |
| **Frontend** | **Handlebars** (`express-handlebars`) | Motor de plantillas para la visualización de la página. |
| **Real-Time** | **Socket.IO** | Comunicación bidireccional para la **actualización en vivo** de productos. |
| **Seguridad** | **`dotenv`** | Gestión de variables de entorno para datos sensibles. |
| **Archivos** | **`multer`** | Manejo de subida de archivos (imágenes) en las peticiones HTTP. (Funcion quitada)| 

### Dependencias de `package.json`

| Nombre | Versión | Tipo |
| :--- | :--- | :--- |
| `dotenv` | `^17.2.3` | Producción / Desarrollo |
| `express` | `^5.1.0` | Producción |
| `express-handlebars` | `^8.0.1` | Producción |
| `moment` | `^2.30.1` | Producción |
| `mongoose` | `^8.19.1` | Producción |
| `mongoose-paginate-v2` | `^1.9.1` | Producción |
| `multer` | `^2.0.2` | Producción |
| `nodemon` | `^3.1.10` | Desarrollo |
| `socket.io` | `^4.8.1` | Producción |

---

## 🛠️ Configuración e Instalación

Para levantar y ejecutar el proyecto localmente, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://www.youtube.com/watch?v=_jABgj6BHCo](https://www.youtube.com/watch?v=_jABgj6BHCo)
    cd BACKSTREET
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade tus credenciales para la base de datos:

    ```env
    # .env
    PORT=8080
    MONGO_URL="mongodb+srv://<user>:<password>@<cluster-url>/<db-name>"
    ```

4.  **Ejecutar el Servidor:**
    ```bash
    npm run start # O npm run dev si usas nodemon
    ```

El servidor estará disponible en `http://localhost:8080`.