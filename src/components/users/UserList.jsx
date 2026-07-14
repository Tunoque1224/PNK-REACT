import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  guardarUsuario,
} from "../../services/userService.js";
import Swal from "sweetalert2";
import UserFormModal from "./UserFormModal.jsx";
function limpiarRut(rut) {
  return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

function validarRut(rutCompleto) {
  const rutLimpio = limpiarRut(rutCompleto);

  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const digitoIngresado = rutLimpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);

  let digitoCalculado;

  if (resultado === 11) {
    digitoCalculado = "0";
  } else if (resultado === 10) {
    digitoCalculado = "K";
  } else {
    digitoCalculado = String(resultado);
  }

  return digitoIngresado === digitoCalculado;
}

function validarNombre(nombre) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre.trim());
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function validarPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function UserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState({});
  const [busqueda, setBusqueda] = useState("");

  async function cargarUsuarios() {
    try {
      setCargando(true);

      const datos = await obtenerUsuarios();

      setUsuarios(datos);
      setError("");
    } catch (error) {
      setError(error.message || "No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);
  const usuariosFiltrados = usuarios.filter((usuario) => {
  const texto = busqueda.trim().toLowerCase();

  if (texto === "") {
    return true;
  }

  const rut = usuario.rut?.toLowerCase() || "";
  const nombre = usuario.nombre?.toLowerCase() || "";
  const rol = usuario.rol?.toLowerCase() || "";

  return (
    rut.includes(texto) ||
    nombre.includes(texto) ||
    rol.includes(texto)
  );
});

  function abrirNuevoUsuario() {
    setUsuarioEditando({
      id: "",
      rut: "",
      nombre: "",
      correo: "",
      password: "",
      rol: "Propietario",
      estado: "Activo",
    });

    setMostrarModal(true);
  }

  function abrirEditar(usuario) {
    setUsuarioEditando({
      ...usuario,
      password: "",
    });

    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setUsuarioEditando({});
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setUsuarioEditando((usuarioActual) => ({
      ...usuarioActual,
      [name]: value,
    }));
  }

  async function handleGuardar() {
  const editando = Boolean(usuarioEditando.id);

  const rut = usuarioEditando.rut?.trim() || "";
  const nombre = usuarioEditando.nombre?.trim() || "";
  const correo = usuarioEditando.correo?.trim() || "";
  const rol = usuarioEditando.rol || "";
  const password = usuarioEditando.password || "";

  if (!rut || !nombre || !correo || !rol) {
    await Swal.fire(
      "Campos incompletos",
      "Debe completar todos los campos obligatorios.",
      "warning"
    );
    return;
  }

  if (!validarRut(rut)) {
    await Swal.fire(
      "RUT inválido",
      "Ingrese un RUT chileno válido, por ejemplo: 12.345.678-5.",
      "warning"
    );
    return;
  }

  if (!validarNombre(nombre)) {
    await Swal.fire(
      "Nombre inválido",
      "El nombre solo puede contener letras y espacios.",
      "warning"
    );
    return;
  }

  if (!validarCorreo(correo)) {
    await Swal.fire(
      "Correo inválido",
      "Ingrese un correo electrónico válido.",
      "warning"
    );
    return;
  }

  if (!editando && !password) {
    await Swal.fire(
      "Contraseña requerida",
      "Debe ingresar una contraseña.",
      "warning"
    );
    return;
  }

  if (!editando && !validarPassword(password)) {
    await Swal.fire(
      "Contraseña inválida",
      "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
      "warning"
    );
    return;
  }

  if (editando && !usuarioEditando.estado) {
    await Swal.fire(
      "Estado requerido",
      "Debe seleccionar el estado del usuario.",
      "warning"
    );
    return;
  }

  const usuarioValidado = {
    ...usuarioEditando,
    rut,
    nombre,
    correo,
  };

  try {
    if (editando) {
      await actualizarUsuario(usuarioValidado);

      await Swal.fire(
        "Actualizado",
        "Usuario actualizado correctamente.",
        "success"
      );
    } else {
      await guardarUsuario(usuarioValidado);

      await Swal.fire(
        "Creado",
        "Usuario creado correctamente.",
        "success"
      );
    }

    cerrarModal();
    await cargarUsuarios();
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message || "No se pudo guardar el usuario.",
      "error"
    );
  }
}

  async function handleEliminar(usuario) {
    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${usuario.nombre}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      await eliminarUsuario(usuario.id);
      await cargarUsuarios();

      await Swal.fire(
        "Eliminado",
        "Usuario eliminado correctamente.",
        "success"
      );
    } catch (error) {
      await Swal.fire(
        "Error",
        error.message || "No se pudo eliminar el usuario.",
        "error"
      );
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de Usuarios</h2>

        <button
          className="btn btn-primary"
          onClick={abrirNuevoUsuario}
        >
          Nuevo Usuario
        </button>
      </div>
      <div className="card shadow-sm mb-4">
  <div className="card-body">
    <div className="row g-3 align-items-end">
      <div className="col-12 col-md-9">
        <label className="form-label">
          Buscar usuario
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Buscar por RUT, nombre o rol"
          value={busqueda}
          onChange={(event) =>
            setBusqueda(event.target.value)
          }
        />
      </div>

      <div className="col-12 col-md-3">
        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => setBusqueda("")}
        >
          Limpiar búsqueda
        </button>
      </div>
    </div>
  </div>
</div>

      {cargando && (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>

          <p className="mt-2">Cargando usuarios...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron usuarios con la búsqueda ingresada.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.rut}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.estado}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => abrirEditar(usuario)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(usuario)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        show={mostrarModal}
        handleClose={cerrarModal}
        usuario={usuarioEditando}
        handleChange={handleChange}
        handleGuardar={handleGuardar}
      />
    </div>
  );
}

export default UserList;