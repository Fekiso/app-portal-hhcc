import { Usuario } from "../interfaces";
import Agenda from "../pages/Agenda/Agenda";
import "./ExploreContainer.css";

interface ContainerProps {
  name: string;
  usuarioLogueado: Usuario;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, usuarioLogueado }) => {
  return (
    <div className="">
      {() => {
        switch (name) {
          case "Agenda":
            return <Agenda usuarioLogueado={usuarioLogueado} />;
          case "RegistrarPaciente":
          // return <TurnosPaciente />;
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
      }}
    </div>
  );
};

export default ExploreContainer;
