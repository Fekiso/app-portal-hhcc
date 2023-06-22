import { useEffect, useState } from "react";
import { Usuario } from "../interfaces";
import Agenda from "../pages/Agenda/Agenda";
import PageError from "../pages/PageError/PageError";
import RegistrarPaciente from "../pages/RegistrarPaciente/RegistrarPaciente";
import "./ExploreContainer.css";
import useUsuario from "../hooks/usuarios";
import { useHistory, useParams } from "react-router";
import FichaPaciente from "./FichaPaciente/FichaPaciente";
import HistoriaClinica from "../pages/HistoriaClinica/HistoriaClinica";
import { IonCard, IonGrid } from "@ionic/react";
import DarTurno from "../pages/DarTurno/DarTurno";

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
      case "Registrar Nuevo Paciente":
        return <RegistrarPaciente usuarioLogueado={usuarioLogueado} />;
        break;
      case "Paciente":
        return <HistoriaClinica usuarioLogueado={usuarioLogueado} />;
        break;
      case "Nuevo Turno":
        return <DarTurno usuarioLogueado={usuarioLogueado} />;
        break;
      default:
        return <PageError motivo="404" />;
        break;
    }
  };

  return <>{renderSwitch()}</>;
};

export default ExploreContainer;
