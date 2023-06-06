import { Usuario } from "../interfaces";
import Agenda from "../pages/Agenda/Agenda";
import RegistrarPaciente from "../pages/RegistrarPaciente/RegistrarPaciente";
import "./ExploreContainer.css";

interface ContainerProps {
  name: string;
  usuarioLogueado: Usuario;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, usuarioLogueado }) => {
  const renderSwitch = () => {
    switch (name) {
      case "Agenda":
        return <Agenda usuarioLogueado={usuarioLogueado} />;
      case "Registrar Paciente":
        return <RegistrarPaciente usuarioLogueado={usuarioLogueado} />;
      case "FichaPaciente":
      // return <HorariosPrestadores />;
      case "RegistrarTurno":
      // return <NuevoTurno />;
      default:
        return (
          <>
            <strong>{name}</strong>
            <p>
              Explore{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://ionicframework.com/docs/components"
              >
                UI Components
              </a>
            </p>
          </>
        );
    }
  };

  return <>{renderSwitch()}</>;
};

export default ExploreContainer;
