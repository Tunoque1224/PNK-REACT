import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";

function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isAdmin = user?.rol === "Administrador";

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">
          PNK Inmobiliaria
        </span>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white">
            {user?.nombre} - {user?.rol}
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="d-flex">
        <aside
          className="bg-white border-end p-3"
          style={{
            width: "230px",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <h5 className="mb-4">Menú</h5>

          <div className="nav flex-column nav-pills gap-2">
            {isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "text-dark"}`
                }
              >
                Dashboard
              </NavLink>
            )}

            <NavLink
              to="/propiedades"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-dark"}`
              }
            >
              Propiedades
            </NavLink>
            <NavLink
    to="/catalogo"
    className={({ isActive }) =>
        `nav-link ${isActive ? "active" : "text-dark"}`
    }
>
    Catálogo Público
</NavLink>

            {isAdmin && (
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "text-dark"}`
                }
              >
                Usuarios
              </NavLink>
            )}
          </div>
        </aside>

        <main className="flex-grow-1 p-3 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;