import { useEffect, useState } from "react";
import {
  obtenerPropiedades,
  guardarPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  obtenerFotosPropiedad,
  marcarFotoPrincipal,
  eliminarFoto,
  cambiarEstadoPropiedad,
} from "../../services/propertyService.js";
import PropertyFormModal from "./PropertyFormModal.jsx";
import PropertyPhotosModal from "./PropertyPhotosModal.jsx";
import { getUser } from "../../services/authService.js";
import { obtenerUsuarios } from "../../services/userService.js";
import Swal from "sweetalert2";

function PropertyList() {
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [propiedadEditando, setPropiedadEditando] = useState({});
  const [mostrarFotos, setMostrarFotos] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [propiedadFotos, setPropiedadFotos] = useState(null);
  const usuario = getUser();
  const esAdministrador = usuario?.rol === "Administrador";
  const [propietarios, setPropietarios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroComuna, setFiltroComuna] = useState("");
  const [filtroSector, setFiltroSector] = useState("");

  async function cargarPropiedades() {
    try {
      setCargando(true);

      const datos = await obtenerPropiedades();

      setPropiedades(datos);
      setError("");
    } catch (error) {
      setError(error.message || "No se pudieron cargar las propiedades");
    } finally {
      setCargando(false);
    }
  }
  async function cargarPropietarios() {
  try {
    const usuarios = await obtenerUsuarios();

    const listaPropietarios = usuarios.filter(
      (usuario) =>
        usuario.rol === "Propietario" &&
        usuario.estado === "Activo"
    );

    setPropietarios(listaPropietarios);
  } catch (error) {
    console.error("No se pudieron cargar los propietarios:", error);
  }
}

  useEffect(() => {
  cargarPropiedades();

  if (esAdministrador) {
    cargarPropietarios();
  }
}, []);
const propiedadesFiltradas = propiedades.filter((propiedad) => {
  const coincideTipo =
    filtroTipo === "" || propiedad.tipo === filtroTipo;

  const coincideComuna =
    propiedad.comuna
      .toLowerCase()
      .includes(filtroComuna.toLowerCase());

  const coincideSector =
    propiedad.sector
      .toLowerCase()
      .includes(filtroSector.toLowerCase());

  return (
    coincideTipo &&
    coincideComuna &&
    coincideSector
  );
});

  function abrirNuevaPropiedad() {
    setPropiedadEditando({
      id: "",
      tipo: "",
      descripcion: "",
      comuna: "",
      sector: "",
      dormitorios: "",
      banos: "",
      precio: "",
      precioUF: "",
      areaConstruida: "",
      areaTerreno: "",
      fecha: "",
      visita: "",
      caracteristicas: [],
      estado: "Publicada",
      id_propietario_admin: "",
    });

    setMostrarModal(true);
  }
  function abrirEditar(propiedad) {
  const caracteristicas = propiedad.caracteristicas
    ? propiedad.caracteristicas
        .split(",")
        .map((caracteristica) => caracteristica.trim())
        .filter(Boolean)
    : [];

  setPropiedadEditando({
    ...propiedad,
    caracteristicas,
    fotos: null,
  });

  setMostrarModal(true);
}

  function cerrarModal() {
    setMostrarModal(false);
    setPropiedadEditando({});
  }

  function handleChange(event) {
  const { name, value } = event.target;

  setPropiedadEditando((propiedadActual) => {
    const nuevaPropiedad = {
      ...propiedadActual,
      [name]: value,
    };

    if (name === "precio") {
      const valorUF = 78158;
      const precio = Number(value);

      nuevaPropiedad.precioUF =
        precio > 0 ? (precio / valorUF).toFixed(2) : "";
    }

    if (name === "tipo" && value === "Terreno") {
      nuevaPropiedad.dormitorios = 0;
      nuevaPropiedad.banos = 0;
      nuevaPropiedad.areaConstruida = 0;
    }

    if (name === "tipo" && value === "Departamento") {
      nuevaPropiedad.areaTerreno = 0;
    }

    return nuevaPropiedad;
  });
}
   function handleCaracteristicaChange(event) {
  const { value, checked } = event.target;

  setPropiedadEditando((propiedadActual) => {
    const caracteristicasActuales =
      propiedadActual.caracteristicas || [];

    const nuevasCaracteristicas = checked
      ? [...caracteristicasActuales, value]
      : caracteristicasActuales.filter(
          (caracteristica) => caracteristica !== value
        );

    return {
      ...propiedadActual,
      caracteristicas: nuevasCaracteristicas,
    };
  });
}

function handleFotosChange(event) {
  const archivos = event.target.files;

  if (archivos.length > 10) {
    alert("Solo puede seleccionar hasta 10 imágenes.");
    event.target.value = "";
    return;
  }

  setPropiedadEditando((propiedadActual) => ({
    ...propiedadActual,
    fotos: archivos,
  }));
}


  async function handleGuardar() {
    if (
  esAdministrador &&
  !propiedadEditando.id &&
  !propiedadEditando.id_propietario_admin
) {
  await Swal.fire(
    "Propietario requerido",
    "Debe seleccionar el propietario de la propiedad.",
    "warning"
  );

  return;
}
  const {
    tipo,
    descripcion,
    comuna,
    sector,
    dormitorios,
    banos,
    precio,
    precioUF,
    areaConstruida,
    areaTerreno,
    fecha,
    visita,
  } = propiedadEditando;

  if (
    !tipo ||
    !descripcion?.trim() ||
    !comuna?.trim() ||
    !sector?.trim() ||
    !precio ||
    !precioUF ||
    !fecha ||
    !visita
  ) {
    await Swal.fire(
      "Campos incompletos",
      "Debe completar todos los campos obligatorios.",
      "warning"
    );
    return;
  }
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  if (
    !soloLetras.test(descripcion.trim()) ||
    !soloLetras.test(comuna.trim()) ||
    !soloLetras.test(sector.trim())
  ) {
    await Swal.fire(
      "Datos inválidos",
      "Descripción, comuna y sector solo permiten letras y espacios.",
      "warning"
    );
    return;
  }

  if (tipo === "Casa") {
    if (
      dormitorios === "" ||
      banos === "" ||
      areaConstruida === "" ||
      areaTerreno === ""
    ) {
      await Swal.fire(
        "Campos incompletos",
        "Complete todos los datos de la casa.",
        "warning"
      );
      return;
    }
  }

  if (tipo === "Departamento") {
    if (
      dormitorios === "" ||
      banos === "" ||
      areaConstruida === ""
    ) {
      await Swal.fire(
        "Campos incompletos",
        "Complete todos los datos del departamento.",
        "warning"
      );
      return;
    }
  }

  if (tipo === "Terreno" && areaTerreno === "") {
    await Swal.fire(
      "Campos incompletos",
      "Complete el área del terreno.",
      "warning"
    );
    return;
  }
  if (
  (tipo === "Casa" || tipo === "Departamento") &&
  (!propiedadEditando.caracteristicas ||
    propiedadEditando.caracteristicas.length === 0)
) {
  await Swal.fire(
    "Características requeridas",
    "Debe seleccionar al menos una característica.",
    "warning"
  );

  return;
}

  if (
    Number(dormitorios || 0) < 0 ||
    Number(banos || 0) < 0 ||
    Number(areaConstruida || 0) < 0 ||
    Number(areaTerreno || 0) < 0
  ) {
    await Swal.fire(
      "Valores inválidos",
      "Dormitorios, baños y áreas no pueden ser negativos.",
      "warning"
    );
    return;
  }

  if (Number(precio) <= 0) {
    await Swal.fire(
      "Precio inválido",
      "El precio debe ser mayor que cero.",
      "warning"
    );
    return;
  }

  const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  if (fechaSeleccionada > fechaActual) {
    await Swal.fire(
      "Fecha inválida",
      "La fecha de publicación no puede ser futura.",
      "warning"
    );
    return;
  }
  if (
  !propiedadEditando.id &&
  (!propiedadEditando.fotos ||
    propiedadEditando.fotos.length === 0)
) {
  await Swal.fire(
    "Fotografía requerida",
    "Debe seleccionar al menos una fotografía.",
    "warning"
  );

  return;
}

  try {
  if (propiedadEditando.id) {
    await actualizarPropiedad({
      ...propiedadEditando,
      descripcion: descripcion.trim(),
      comuna: comuna.trim(),
      sector: sector.trim(),
    });

    await Swal.fire(
      "Propiedad actualizada",
      "La propiedad fue actualizada correctamente.",
      "success"
    );
  } else {
    await guardarPropiedad({
      ...propiedadEditando,
      descripcion: descripcion.trim(),
      comuna: comuna.trim(),
      sector: sector.trim(),
    });

    await Swal.fire(
      "Propiedad creada",
      "La propiedad fue guardada correctamente.",
      "success"
    );
  }

  cerrarModal();
  await cargarPropiedades();

  } catch (error) {
    await Swal.fire(
      "Error",
      error.message || "No se pudo guardar la propiedad.",
      "error"
    );
  }
}

async function handleEliminar(propiedad) {
  const resultado = await Swal.fire({
    title: "¿Eliminar propiedad?",
    text: `Se eliminará la propiedad: ${propiedad.descripcion}`,
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
    await eliminarPropiedad(propiedad.id);

    await Swal.fire(
      "Propiedad eliminada",
      "La propiedad fue eliminada correctamente.",
      "success"
    );

    await cargarPropiedades();
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message || "No se pudo eliminar la propiedad.",
      "error"
    );
  }
}
async function abrirFotos(propiedad) {
  try {
    const fotosPropiedad = await obtenerFotosPropiedad(propiedad.id);

    setFotos(fotosPropiedad);
    setPropiedadFotos(propiedad);
    setMostrarFotos(true);
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message || "No se pudieron cargar las fotografías.",
      "error"
    );
  }
}

function cerrarFotos() {
  setMostrarFotos(false);
  setFotos([]);
  setPropiedadFotos(null);
}
async function handlePrincipal(idFoto, idPropiedad) {
  try {
    await marcarFotoPrincipal(idFoto, idPropiedad);

    const fotosActualizadas =
      await obtenerFotosPropiedad(idPropiedad);

    setFotos(fotosActualizadas);
    await cargarPropiedades();

    await Swal.fire(
      "Imagen principal actualizada",
      "El cambio fue guardado correctamente.",
      "success"
    );
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message ||
        "No se pudo cambiar la imagen principal.",
      "error"
    );
  }
}

async function handleEliminarFoto(idFoto, idPropiedad) {
  const resultado = await Swal.fire({
    title: "¿Eliminar foto?",
    text: "Esta imagen se eliminará de la propiedad.",
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
    await eliminarFoto(idFoto, idPropiedad);

    const fotosActualizadas =
      await obtenerFotosPropiedad(idPropiedad);

    setFotos(fotosActualizadas);
    await cargarPropiedades();

    await Swal.fire(
      "Fotografía eliminada",
      "La imagen fue eliminada correctamente.",
      "success"
    );
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message ||
        "No se pudo eliminar la fotografía.",
      "error"
    );
  }
}
async function handleCambiarEstado(propiedad) {
  const resultado = await Swal.fire({
    title: "Cambiar estado",
    input: "select",
    inputOptions: {
      Publicada: "Publicada",
      Desactivada: "Desactivada",
      Vendida: "Vendida",
    },
    inputValue: propiedad.estado || "Publicada",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  });

  if (!resultado.isConfirmed) {
    return;
  }

  try {
    await cambiarEstadoPropiedad(
      propiedad.id,
      resultado.value
    );

    await Swal.fire(
      "Estado actualizado",
      "El estado fue cambiado correctamente.",
      "success"
    );

    await cargarPropiedades();
  } catch (error) {
    await Swal.fire(
      "Error",
      error.message || "No se pudo cambiar el estado.",
      "error"
    );
  }
}
return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de Propiedades</h2>

        <button
          className="btn btn-primary"
          onClick={abrirNuevaPropiedad}
        >
          Nueva Propiedad
        </button>
      </div>
      <div className="card shadow-sm mb-4">
  <div className="card-body">
    <div className="row g-3 align-items-end">
      <div className="col-12 col-md-3">
        <label className="form-label">
          Tipo de propiedad
        </label>

        <select
          className="form-select"
          value={filtroTipo}
          onChange={(event) =>
            setFiltroTipo(event.target.value)
          }
        >
          <option value="">Todos los tipos</option>
          <option value="Casa">Casa</option>
          <option value="Departamento">Departamento</option>
          <option value="Terreno">Terreno</option>
        </select>
      </div>

      <div className="col-12 col-md-3">
        <label className="form-label">
          Comuna
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Ejemplo: La Serena"
          value={filtroComuna}
          onChange={(event) =>
            setFiltroComuna(event.target.value)
          }
        />
      </div>

      <div className="col-12 col-md-3">
        <label className="form-label">
          Sector
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Ejemplo: El Milagro"
          value={filtroSector}
          onChange={(event) =>
            setFiltroSector(event.target.value)
          }
        />
      </div>

      <div className="col-12 col-md-3">
        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => {
            setFiltroTipo("");
            setFiltroComuna("");
            setFiltroSector("");
          }}
        >
          Limpiar filtros
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

          <p className="mt-2">Cargando propiedades...</p>
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
                <th>Tipo</th>
                <th>Foto</th>
                <th>Descripción</th>
                <th>Comuna</th>
                <th>Sector</th>
                <th>Dormitorios</th>
                <th>Baños</th>
                <th>Área terreno</th>
                <th>Área construida</th>
                <th>Precio</th>
                <th>UF</th>
                <th>Estado</th>

                   {esAdministrador && (
                   <th>Propietario</th>
              )}

                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {propiedadesFiltradas.length === 0 ? (
                <tr>
                  <td
  colSpan={esAdministrador ? 15 : 14}
  className="text-center"
>
                    No se encontraron propiedades con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                propiedadesFiltradas.map((propiedad) => (
                  <tr key={propiedad.id}>
                    <td>{propiedad.id}</td>
                    <td>{propiedad.tipo}</td>
                    <td>
{propiedad.imagen_principal ? (
    <img
      src={`http://localhost:82/PNK-INMOBILIARIA/${propiedad.imagen_principal}`}
      alt="Imagen principal"
      width="110"
      height="80"
      style={{
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  ) : (
    "Sin imagen"
  )}
</td>
                    <td>{propiedad.descripcion}</td>
                    <td>{propiedad.comuna}</td>
                    <td>{propiedad.sector}</td>
                    <td>{propiedad.dormitorios}</td>
                    <td>{propiedad.banos}</td>
                    <td>{propiedad.areaTerreno} m²</td>
                    <td>{propiedad.areaConstruida} m²</td>

                    <td>
                      ${Number(propiedad.precio || 0).toLocaleString("es-CL")}
                    </td>

                    <td>{propiedad.precioUF} UF</td>
                    <td>{propiedad.estado || "Sin estado"}</td>

{esAdministrador && (
  <td>
    <strong>
      {propiedad.propietario_nombre}
    </strong>

    <br />

    <small className="text-muted">
      {propiedad.propietario_correo}
    </small>
  </td>
)}

<td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                         onClick={() => abrirEditar(propiedad)}
                         >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                         onClick={() => handleEliminar(propiedad)}
                         >
                        Eliminar
                      </button>

                      <button
                        className="btn btn-info btn-sm me-2"
                         onClick={() => abrirFotos(propiedad)}
                         >
                        Fotos
                      </button>

                       {esAdministrador && (
                      <button
                        className="btn btn-secondary btn-sm mt-2"
                         onClick={() => handleCambiarEstado(propiedad)}
                         >
                        Cambiar estado
                      </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <PropertyFormModal
  show={mostrarModal}
  handleClose={cerrarModal}
  propiedad={propiedadEditando}
  handleChange={handleChange}
  handleCaracteristicaChange={handleCaracteristicaChange}
  handleFotosChange={handleFotosChange}
  handleGuardar={handleGuardar}
  propietarios={propietarios}
  esAdministrador={esAdministrador}
/>

<PropertyPhotosModal
  show={mostrarFotos}
  handleClose={cerrarFotos}
  fotos={fotos}
  propiedad={propiedadFotos}
  handlePrincipal={handlePrincipal}
  handleEliminarFoto={handleEliminarFoto}
/>
    </div>
  );
}

export default PropertyList;