const API_URL = "http://98.90.238.74/api/propiedades.php";

export async function obtenerPropiedades() {
  const respuesta = await fetch(API_URL, {
    credentials: "include",
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener las propiedades");
  }

  return await respuesta.json();
}
export async function guardarPropiedad(propiedad) {
  const datos = new FormData();

  datos.append("tipo", propiedad.tipo);
  datos.append("descripcion", propiedad.descripcion);
  datos.append("comuna", propiedad.comuna);
  datos.append("sector", propiedad.sector);
  datos.append("dormitorios", propiedad.dormitorios);
  datos.append("banos", propiedad.banos);
  datos.append("precio", propiedad.precio);
  datos.append("precioUF", propiedad.precioUF);
  datos.append("areaConstruida", propiedad.areaConstruida);
  datos.append("areaTerreno", propiedad.areaTerreno);
  datos.append("fecha", propiedad.fecha);
  datos.append("visita", propiedad.visita);

  (propiedad.caracteristicas || []).forEach((caracteristica) => {
    datos.append("caracteristicas[]", caracteristica);
  });

  if (propiedad.fotos) {
    Array.from(propiedad.fotos).forEach((foto) => {
      datos.append("fotos[]", foto);
    });
  }
  if (propiedad.id_propietario_admin) {
  datos.append(
    "id_propietario_admin",
    propiedad.id_propietario_admin
  );
}

  const respuesta = await fetch(
    "http://98.90.238.74/api/guardar_propiedad.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "Error al guardar la propiedad"
    );
  }

  return resultado;
}
export async function actualizarPropiedad(propiedad) {
  const datos = new FormData();

  datos.append("id", propiedad.id);
  datos.append("tipo", propiedad.tipo);
  datos.append("descripcion", propiedad.descripcion);
  datos.append("comuna", propiedad.comuna);
  datos.append("sector", propiedad.sector);
  datos.append("dormitorios", propiedad.dormitorios);
  datos.append("banos", propiedad.banos);
  datos.append("precio", propiedad.precio);
  datos.append("precioUF", propiedad.precioUF);
  datos.append("areaConstruida", propiedad.areaConstruida);
  datos.append("areaTerreno", propiedad.areaTerreno);
  datos.append("fecha", propiedad.fecha);
  datos.append("visita", propiedad.visita);

  (propiedad.caracteristicas || []).forEach((caracteristica) => {
    datos.append("caracteristicas[]", caracteristica);
  });

  const respuesta = await fetch(
    "http://98.90.238.74/api/actualizar_propiedad.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "Error al actualizar la propiedad"
    );
  }

  return resultado;
}
export async function eliminarPropiedad(id) {
  const datos = new FormData();
  datos.append("id", id);

  const respuesta = await fetch(
    "http://98.90.238.74/api/eliminar_propiedad.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "Error al eliminar la propiedad"
    );
  }

  return resultado;
}
export async function obtenerFotosPropiedad(idPropiedad) {
  const respuesta = await fetch(
    `http://98.90.238.74/api/fotos_propiedad.php?id_propiedad=${idPropiedad}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "Error al obtener las fotografías"
    );
  }

  return resultado.fotos;
}
export async function marcarFotoPrincipal(idFoto, idPropiedad) {
  const datos = new FormData();

  datos.append("id_foto", idFoto);
  datos.append("id_propiedad", idPropiedad);

  const respuesta = await fetch(
    "http://98.90.238.74/api/marcar_foto_principal.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "No se pudo cambiar la imagen principal"
    );
  }

  return resultado;
}

export async function eliminarFoto(idFoto, idPropiedad) {
  const datos = new FormData();

  datos.append("id_foto", idFoto);
  datos.append("id_propiedad", idPropiedad);

  const respuesta = await fetch(
    "http://98.90.238.74/api/eliminar_foto.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "No se pudo eliminar la fotografía"
    );
  }

  return resultado;
}
export async function cambiarEstadoPropiedad(id, estado) {
  const datos = new FormData();

  datos.append("id", id);
  datos.append("estado", estado);

  const respuesta = await fetch(
    "http://98.90.238.74/api/cambiar_estado_propiedad.php",
    {
      method: "POST",
      body: datos,
      credentials: "include",
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "No se pudo cambiar el estado."
    );
  }

  return resultado;
}