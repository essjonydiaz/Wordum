const API = '/api/documentos';
const TITULO_MAX = 150;
const ESPERA_AUTOGUARDADO = 2000;   // ms sin escribir antes de guardar solo

// id del documento abierto (null = documento nuevo sin guardar)
let documentoActualId = null;

// Copia local de la lista: el buscador y el orden trabajan sobre esto,
// sin volver a pedirle nada al servidor.
let documentos = [];

let temporizador = null;   // debounce del autoguardado
let guardando = false;

const $titulo    = document.getElementById('titulo');
const $contenido = document.getElementById('contenido');
const $autor     = document.getElementById('autor');
const $estado    = document.getElementById('estado');
const $btn       = document.getElementById('btnGuardar');
const $error     = document.getElementById('avisoError');

cargarDocumentos();

// Ctrl+S / Cmd+S para guardar
document.addEventListener('keydown', e => {
    if (modalAbierto) return;   // mientras se confirma un borrado, no guardar
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        guardar();
    }
});

// ---------- GET: traer la lista ----------
async function cargarDocumentos() {
    try {
        const respuesta = await fetch(API);
        if (!respuesta.ok) throw new Error('respuesta ' + respuesta.status);
        documentos = await respuesta.json();
        pintarLista();
    } catch (e) {
        mostrarError('No se pudo cargar la lista, revisa tu conexión');
    }
}

// Filtra por el buscador, ordena segun el selector y dibuja la lista
function pintarLista() {
    const lista  = document.getElementById('listaDocumentos');
    const filtro = document.getElementById('buscador').value.trim().toLowerCase();
    const orden  = document.getElementById('orden').value;

    let visibles = documentos.filter(doc =>
        (doc.title || '').toLowerCase().includes(filtro));

    if (orden === 'titulo') {
        visibles.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'es'));
    } else {
        visibles.sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''));
    }

    document.getElementById('contador').textContent = visibles.length;
    lista.innerHTML = '';

    if (visibles.length === 0) {
        const vacio = document.createElement('li');
        vacio.className = 'vacio';
        vacio.textContent = filtro === ''
            ? 'Todavía no hay documentos guardados'
            : 'Ningún documento coincide con "' + filtro + '"';
        lista.appendChild(vacio);
        return;
    }

    visibles.forEach(doc => {
        const item = document.createElement('li');
        if (doc.id === documentoActualId) item.className = 'activo';
        item.onclick = () => abrirDocumento(doc);

        const titulo = document.createElement('div');
        titulo.className = 'doc-titulo';
        titulo.textContent = doc.title || 'Sin título';

        const fecha = document.createElement('div');
        fecha.className = 'doc-fecha';
        fecha.textContent = formatearFecha(doc.lastModified);

        const borrar = document.createElement('button');
        borrar.className = 'borrar';
        borrar.title = 'Eliminar documento';
        borrar.setAttribute('aria-label', 'Eliminar documento');
        borrar.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6' +
            'm3 0v13.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5V6M10 11v5M14 11v5"/></svg>';
        borrar.onclick = (e) => { e.stopPropagation(); eliminar(doc); };

        item.append(titulo, fecha, borrar);
        lista.appendChild(item);
    });
}

// ---------- Abrir un documento en el editor ----------
function abrirDocumento(doc) {
    clearTimeout(temporizador);
    documentoActualId = doc.id;
    $titulo.value    = doc.title   || '';
    $contenido.value = doc.content || '';
    $autor.value     = doc.author  || '';
    actualizarPie();
    mostrarEstado('Guardado', 'ok');
    pintarLista();
}

function nuevoDocumento() {
    clearTimeout(temporizador);
    documentoActualId = null;
    $titulo.value = '';
    $contenido.value = '';
    $autor.value = '';
    actualizarPie();
    mostrarEstado('Documento nuevo');
    $titulo.focus();
    pintarLista();
}


// ---------- POST / PUT: guardar ----------
// automatico = true cuando lo dispara el autoguardado (no avisa si falta titulo)
async function guardar(automatico) {
    clearTimeout(temporizador);

    const titulo = $titulo.value.trim();

    if (titulo === '') {
        if (!automatico) {
            mostrarError('El título no puede estar vacío');
            $titulo.focus();
        }
        return;
    }
    if (titulo.length > TITULO_MAX) {
        mostrarError('El título no puede superar los ' + TITULO_MAX + ' caracteres');
        return;
    }
    if (guardando) return;

    const datos = {
        title:   titulo,
        content: $contenido.value,
        author:  $autor.value.trim()
    };

    guardando = true;
    $btn.disabled = true;
    mostrarEstado('Guardando…', 'enviando');

    try {
        // Sin id es documento nuevo (POST); con id se actualiza (PUT)
        const esNuevo = documentoActualId === null;
        const respuesta = await fetch(esNuevo ? API : API + '/' + documentoActualId, {
            method:  esNuevo ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(datos)
        });

        if (!respuesta.ok) throw new Error('respuesta ' + respuesta.status);

        const guardado = await respuesta.json();
        documentoActualId = guardado.id;
        mostrarEstado('Guardado', 'ok');
        await cargarDocumentos();

    } catch (e) {
        mostrarEstado('Cambios sin guardar', 'pendiente');
        mostrarError('No se pudo guardar, revisa tu conexión');
    } finally {
        guardando = false;
        $btn.disabled = false;
    }
}

// ---------- Ventana de confirmacion (reemplaza al confirm del navegador) ----------
const $capaModal = document.getElementById('capaModal');
const $modalOk   = document.getElementById('modalAceptar');
const $modalNo   = document.getElementById('modalCancelar');

let modalAbierto = false;

function confirmarEliminar(nombre) {
    return new Promise(resolve => {
        document.getElementById('modalNombre').textContent = '"' + nombre + '"';
        $capaModal.classList.add('visible');
        modalAbierto = true;
        $modalOk.focus();

        const cerrar = (respuesta) => {
            $capaModal.classList.remove('visible');
            modalAbierto = false;
            document.removeEventListener('keydown', alTeclado);
            resolve(respuesta);
        };

        const alTeclado = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); cerrar(false); }
            if (e.key === 'Enter')  { e.preventDefault(); cerrar(true);  }
        };

        $modalOk.onclick = () => cerrar(true);
        $modalNo.onclick = () => cerrar(false);
        // Un clic fuera de la tarjeta equivale a cancelar
        $capaModal.onclick = (e) => { if (e.target === $capaModal) cerrar(false); };

        document.addEventListener('keydown', alTeclado);
    });
}

// ---------- DELETE ----------
async function eliminar(doc) {
    const confirmado = await confirmarEliminar(doc.title || 'Sin título');
    if (!confirmado) return;

    try {
        const respuesta = await fetch(API + '/' + doc.id, { method: 'DELETE' });
        if (!respuesta.ok) throw new Error('respuesta ' + respuesta.status);

        // Si era el que estaba abierto, dejar el editor limpio
        if (doc.id === documentoActualId) nuevoDocumento();
        await cargarDocumentos();

    } catch (e) {
        mostrarError('No se pudo eliminar, revisa tu conexión');
    }
}

// ---------- Escritura y autoguardado ----------
function alEscribir() {
    actualizarPie();
    mostrarEstado('Cambios sin guardar', 'pendiente');

    // Reinicia la cuenta: solo guarda cuando dejas de escribir
    clearTimeout(temporizador);
    temporizador = setTimeout(() => guardar(true), ESPERA_AUTOGUARDADO);
}

function actualizarPie() {
    const texto = $contenido.value.trim();
    const palabras = texto === '' ? 0 : texto.split(/\s+/).length;
    document.getElementById('conteo').textContent =
        palabras + (palabras === 1 ? ' palabra' : ' palabras');

    const largo = $titulo.value.length;
    const limite = document.getElementById('limite');
    // Avisar cuando el titulo se acerca al maximo que acepta la API
    limite.textContent = largo > TITULO_MAX - 30 ? 'Título: ' + largo + '/' + TITULO_MAX : '';
    limite.className = largo >= TITULO_MAX ? 'aviso' : '';
}

// ---------- Avisos ----------
function mostrarEstado(mensaje, tipo) {
    $estado.textContent = mensaje;
    $estado.className = 'estado ' + (tipo || '');
}

let temporizadorError = null;
function mostrarError(mensaje) {
    $error.textContent = mensaje;
    $error.classList.add('visible');

    clearTimeout(temporizadorError);
    temporizadorError = setTimeout(() => $error.classList.remove('visible'), 4500);
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    const hoy = new Date();
    const mismoDia = d.toDateString() === hoy.toDateString();

    return mismoDia
        ? 'Hoy, ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}
