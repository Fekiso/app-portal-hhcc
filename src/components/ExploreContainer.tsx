import { useEffect, useState } from "react";
import { Paciente, Usuario } from "../interfaces";
import Agenda from "../pages/Agenda/Agenda";
import PageError from "../pages/PageError/PageError";
import RegistrarPaciente from "../pages/RegistrarPaciente/RegistrarPaciente";
import "./ExploreContainer.css";
import useUsuario from "../hooks/usuarios";
import { useHistory, useParams } from "react-router";
import FichaPaciente from "./FichaPaciente/FichaPaciente";

interface ContainerProps {
  usuarioLogueado: Usuario;
}

const ExploreContainer: React.FC<ContainerProps> = ({ usuarioLogueado }) => {
  let usuario: Usuario = {
    usuario: "",
    password: "",
    token: "",
    codigo: 0,
    especialidadNom: "",
    nombreCompleto: "",
    nombreUsuario: "",
    prestadorCod: 0,
    prestadorNom: "",
    prestadores: [],
    rol: "",
  };
  const [paciente, setPaciente] = useState<Paciente>();

  const { recuperarSesion } = useUsuario();
  const { name } = useParams<{ name: string }>();
  const history = useHistory();

  useEffect(() => {
    if (usuarioLogueado) {
      usuario = usuarioLogueado;
    } else {
      try {
        usuario = recuperarSesion();
      } catch (e) {
        console.log(e);
        history.push("/ErrorPage");
      }
    }
  }, []);

  const renderSwitch = () => {
    switch (name) {
      case "Agenda":
        return <Agenda usuarioLogueado={usuarioLogueado} />;
        break;
      case "Registrar Paciente":
        return <RegistrarPaciente usuarioLogueado={usuarioLogueado} />;
        break;
      case "Ficha Paciente":
        return <FichaPaciente usuarioLogueado={usuarioLogueado} setPacienteProp={setPaciente} />;
        break;
      case "RegistrarTurno":
        // return <NuevoTurno />;
        break;
      default:
        return <PageError motivo="404" />;
        break;
    }
  };

  return <>{renderSwitch()}</>;
};

export default ExploreContainer;
