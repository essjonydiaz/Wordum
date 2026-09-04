# Actividad de cierre — Práctica 1 (React + Vite)

## 1. ¿Qué función cumple React en nuestro proyecto?

React es la **capa de presentación**: se encarga de todo lo que el usuario ve y de
reaccionar a lo que escribe, sin tener que recargar la página.

En este proyecto, el componente `Editor.jsx` guarda en su estado lo que voy tecleando
en el título y en el contenido, y recalcula los contadores de caracteres y palabras
en el momento. React se ocupa de volver a dibujar en pantalla solo lo que cambió.

React **no guarda nada de forma permanente**: si recargo la página, lo que escribí
se pierde. Para conservarlo hace falta el backend.

## 2. ¿Qué función cumple Spring Boot?

Spring Boot es el **backend**: el programa que corre en el servidor y que no se ve
en pantalla. Sus tres trabajos son:

1. **Exponer la API REST** — los endpoints `/api/documentos` y `/api/status`,
   que responden en JSON.
2. **Aplicar la lógica de negocio** — en `DocumentService` es donde se ponen las
   fechas de creación y modificación, y en `DocumentController` se valida que el
   título no venga vacío ni pase de 150 caracteres.
3. **Hablar con la base de datos** — a través de Spring Data JPA guarda y consulta
   los documentos en H2.

Dicho corto: React es la cara de la aplicación y Spring Boot es la memoria y las reglas.

## 3. ¿Qué diferencia existe entre localhost:5173 y localhost:8080?

Son **dos aplicaciones distintas**, cada una con su propio servidor, corriendo al
mismo tiempo en mi computadora:

| | localhost:5173 | localhost:8080 |
|---|---|---|
| Qué corre ahí | El frontend de React | El backend de Spring Boot |
| Qué servidor lo sirve | Vite (servidor de desarrollo) | Tomcat (viene integrado en Spring Boot) |
| Con qué se arranca | `npm run dev` | `.\mvnw.cmd spring-boot:run` |
| Qué devuelve | Páginas HTML y JavaScript | Datos en JSON |

`localhost` significa "esta misma computadora". El número que va después de los dos
puntos es el **puerto**, que sirve para distinguir un programa de otro dentro de la
misma máquina. Son procesos independientes: puedo apagar uno y el otro sigue
funcionando, y por eso hay que correrlos en dos terminales separadas.

En esta práctica **todavía no se comunican entre sí**. Eso queda para la siguiente.

## 4. ¿Qué función cumple useState()?

`useState()` es el hook que le da **memoria a un componente** de React.

Devuelve dos cosas: el valor actual y una función para cambiarlo.

```jsx
const [titulo, setTitulo] = useState("");
//     ↑         ↑
//   valor    función que lo modifica
```

Cuando llamo a `setTitulo("Hola")`, React guarda el valor nuevo **y vuelve a
renderizar el componente**, así que todo lo que dependa de esa variable se actualiza
solo en la pantalla.

En `Editor.jsx` uso dos estados: `titulo` y `contenido`. Sin `useState` yo podría
escribir en el input, pero React no estaría guardando ese texto en ninguna variable:
los contadores de caracteres y palabras nunca se actualizarían, y el botón Guardar
no tendría de dónde sacar el documento.

---

## Reto: contador de palabras

Además del contador de caracteres, agregué el de palabras en `Editor.jsx`:

```jsx
const palabras =
  contenido.trim() === "" ? 0 : contenido.trim().split(/\s+/).length;
```

`trim()` quita los espacios de los extremos, y `split(/\s+/)` corta el texto por
cualquier bloque de espacios o saltos de línea. El caso del texto vacío se revisa
aparte, porque `"".split()` devolvería un arreglo de un elemento y contaría 1
palabra cuando en realidad no hay ninguna.
