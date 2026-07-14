import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h1>Panel de Administración</h1>
        <p className="text-muted">
          Bienvenido al sistema de gestión de PNK Inmobiliaria.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center p-4">
              <h2>🏠</h2>
              <h4>Propiedades</h4>
              <p className="text-muted">
                Crear, editar, eliminar y administrar fotografías.
              </p>

              <Link to="/propiedades" className="btn btn-primary">
                Ver Propiedades
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center p-4">
              <h2>👤</h2>
              <h4>Usuarios</h4>
              <p className="text-muted">
                Crear, editar y administrar usuarios del sistema.
              </p>

              <Link to="/usuarios" className="btn btn-primary">
                Ver Usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;