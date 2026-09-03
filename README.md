# Editor de Documentos como Servicio (SaaS)

Proyecto integrador de la unidad **Cómputo en la Nube — Software como Servicio (SaaS)**.

Editor de documentos de texto que corre en un servidor y se consume desde el navegador,
sin instalar nada en la computadora del usuario. Construido con Spring Boot.

---

## Cómo ejecutar el proyecto

Desde la carpeta raíz del proyecto:

**Windows (PowerShell):**
```powershell
.\mvnw.cmd spring-boot:run
```

**Mac / Linux:**
```bash
./mvnw spring-boot:run
```

La aplicación arranca en el puerto **8080**. Espera a ver en la terminal la línea:

```
Started EditorTextoSaasApplication in X seconds
```

> **Si sale el error `JAVA_HOME environment variable is not defined correctly`:**
> configura la variable apuntando a tu JDK antes de ejecutar. En este equipo:
> ```powershell
> $env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.11"
> ```

> **Si sale `Port 8080 was already in use`:** ya hay otra instancia corriendo.
> Ciérrala con `Ctrl + C` en la terminal donde esté, o reinicia el equipo.

---

## URLs para probar cada fase

| Fase | Qué se probó | URL | Resultado esperado |
|:---:|---|---|---|
| **1** | Endpoint de prueba | `http://localhost:8080/api/status` | El texto `Editor de texto SaaS funcionando correctamente` |
| **2** | Base de datos H2 | `http://localhost:8080/h2-console` | La consola de la base de datos con la tabla creada |
| **3** | API REST (CRUD) | `http://localhost:8080/api/documentos` | El JSON con la lista de documentos |
| **4** | Interfaz web | `http://localhost:8080/` | El editor completo, con lista de documentos |

### Datos para entrar a la consola H2 (Fase 2)

| Campo | Valor |
|---|---|
| JDBC URL | `jdbc:h2:mem:editordb` |
| User Name | `sa` |
| Password | *(vacío)* |

Al conectar, la tabla **`DOCUMENT`** aparece en el panel izquierdo. Se creó sola
gracias a `spring.jpa.hibernate.ddl-auto=update`, sin escribir SQL.

> ⚠️ La base de datos es **en memoria**: al detener la aplicación se borra todo.
> Es intencional para la clase; en la nube real se usaría un servicio administrado
> como Amazon RDS o Google Cloud SQL.

---

## Documentación de la API

**URL base:** `http://localhost:8080/api/documentos`

| # | Método | URL | Descripción |
|:---:|---|---|---|
| 1 | `GET` | `/api/documentos` | Devuelve la lista completa de documentos |
| 2 | `GET` | `/api/documentos/{id}` | Devuelve un documento por su id |
| 3 | `POST` | `/api/documentos` | Crea un documento nuevo |
| 4 | `PUT` | `/api/documentos/{id}` | Actualiza el título y contenido de un documento |
| 5 | `DELETE` | `/api/documentos/{id}` | Elimina un documento |

### Ejemplos de body (JSON)

Solo `POST` y `PUT` llevan body. Ambos requieren el header:

```
Content-Type: application/json
```

**POST** — crear:
```json
{
  "title": "Mi primer documento",
  "content": "Hola mundo",
  "author": "Alumno"
}
```

**PUT** — actualizar:
```json
{
  "title": "Mi primer documento (editado)",
  "content": "Contenido actualizado"
}
```

**Respuesta** (tanto de `POST` como de `PUT`):
```json
{
  "id": 1,
  "title": "Mi primer documento",
  "content": "Hola mundo",
  "author": "Alumno",
  "createdAt": "2026-08-18T20:03:49.781",
  "lastModified": "2026-08-18T20:03:49.781"
}
```

### Validaciones

El servidor rechaza la petición (`POST` y `PUT`) si:

| Regla | Mensaje de error |
|---|---|
| El título viene vacío o solo con espacios | `El titulo no puede estar vacio` |
| El título supera los 150 caracteres | `El titulo no puede superar los 150 caracteres` |

---

## Cómo probar los 5 endpoints con Postman

Haz las pruebas **en este orden** — cada una depende de la anterior.

### 1. GET — lista vacía

- **Método:** `GET`
- **URL:** `http://localhost:8080/api/documentos`
- Sin body, sin headers.

**Esperado:** `[]` (una lista vacía, porque todavía no hay nada guardado).

### 2. POST — crear un documento

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/documentos`
- **Headers:** pestaña *Headers* → `Content-Type` : `application/json`
- **Body:** pestaña *Body* → marca **raw** → en el desplegable de la derecha elige **JSON**

```json
{
  "title": "Mi primer documento",
  "content": "Hola mundo",
  "author": "Alumno"
}
```

**Esperado:** el documento creado, ahora **con un `id`** y con las dos fechas llenas.
Anota ese `id` (normalmente `1`) porque lo usarás en los siguientes pasos.

> Si eliges **raw → JSON** en Postman, el header `Content-Type: application/json`
> se agrega solo. Si lo escribes a mano, asegúrate de que no quede duplicado.

### 3. GET por id — recuperar el documento

- **Método:** `GET`
- **URL:** `http://localhost:8080/api/documentos/1`

**Esperado:** el mismo documento que creaste en el paso 2.

### 4. PUT — actualizar el documento

- **Método:** `PUT`
- **URL:** `http://localhost:8080/api/documentos/1`
- **Headers:** `Content-Type` : `application/json`
- **Body:** raw → JSON

```json
{
  "title": "Mi primer documento (editado)",
  "content": "Este contenido ya fue actualizado"
}
```

**Esperado:** el documento con el título y contenido nuevos. Fíjate que
`lastModified` cambió pero `createdAt` sigue igual — así se comprueba que
la fecha de creación se respeta y solo se toca la de modificación.

### 5. DELETE — eliminar el documento

- **Método:** `DELETE`
- **URL:** `http://localhost:8080/api/documentos/1`
- Sin body.

**Esperado:** respuesta vacía con estado `200 OK`.

**Para confirmar que se borró**, repite el paso 1 (`GET` a la lista): debe volver
a devolver `[]`. Y un `GET` a `/api/documentos/1` ahora falla, porque ese
documento ya no existe.

### Pruebas extra de las validaciones

| Prueba | Body | Resultado esperado |
|---|---|---|
| Título vacío | `{"title": "", "content": "x"}` | Error — `El titulo no puede estar vacio` |
| Título muy largo | `{"title": "aaa…"}` con más de 150 letras | Error — `El titulo no puede superar los 150 caracteres` |

---

## Estructura del proyecto

```
src/main/java/com/example/editortextosaas/
├── EditorTextoSaasApplication.java   Clase principal (arranca Spring Boot)
├── controller/                       Endpoints REST
│   ├── StatusController.java         GET /api/status  (Fase 1)
│   └── DocumentController.java       CRUD /api/documentos  (Fase 3)
├── service/
│   └── DocumentService.java          Lógica de negocio  (Fase 3)
├── repository/
│   └── DocumentRepository.java       Acceso a datos  (Fase 2)
└── model/
    └── Document.java                 Entidad JPA  (Fase 2)

src/main/resources/
├── application.properties            Configuración de H2
└── static/
    ├── index.html                    Estructura de la pagina  (Fase 4)
    ├── styles.css                    Estilos  (Fase 4)
    └── app.js                        Logica del navegador  (Fase 4)
```

### Sobre la capa de servicio

`DocumentController` **no habla directamente con la base de datos**: le pide todo a
`DocumentService`, y ese servicio es quien usa `DocumentRepository`. Separarlo así
mantiene el controlador dedicado solo a recibir peticiones HTTP y devolver respuestas,
mientras la lógica (poner fechas, verificar que el documento exista) vive en un
solo lugar.

`DocumentRepository` no tiene ni una línea de código: al extender `JpaRepository`
hereda automáticamente `save()`, `findAll()`, `findById()` y `deleteById()`,
sin escribir SQL.

---

## Nota sobre los nombres de los campos

La entidad usa nombres en inglés (`title`, `content`, `author`, `createdAt`,
`lastModified`), por lo que el JSON de la API también los usa. La equivalencia
con la especificación original es:

| Especificación | En este proyecto |
|---|---|
| `titulo` | `title` |
| `contenido` | `content` |
| `autor` | `author` |
| `fechaCreacion` | `createdAt` |
| `fechaModificacion` | `lastModified` |

Las **URLs sí están en español** (`/api/documentos`), tal como pide la especificación.

---

## Tecnologías

| Componente | Versión / herramienta |
|---|---|
| Java | 17 (compilado con JDK 21) |
| Spring Boot | 4.1.0 |
| Build | Maven (con wrapper incluido) |
| Base de datos | H2 en memoria |
| Persistencia | Spring Data JPA + Hibernate |
| Front-end | HTML + CSS + JavaScript vanilla (sin frameworks) |