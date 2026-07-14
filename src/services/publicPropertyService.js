const API_URL =
  "http://98.90.238.74/api/propiedades_publicas.php";

export async function obtenerPropiedadesPublicas() {
  const respuesta = await fetch(API_URL);

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje || "No se pudieron cargar las propiedades."
    );
  }

  return resultado;
}
export async function obtenerDetallePropiedad(id) {
  const respuesta = await fetch(
    `http://98.90.238.74/api/detalle_propiedad_publica.php?id=${id}`
  );

  let resultado;

  try {
    resultado = await respuesta.json();
  } catch {
    throw new Error("La API no entregó una respuesta válida.");
  }

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "No se pudo cargar la propiedad."
    );
  }

  return resultado;
}