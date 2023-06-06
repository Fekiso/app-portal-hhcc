import { useState } from "react";
import "./DialogoConfirmacion.css";
import { Paciente } from "../../interfaces";

interface ContainerProps {
  setPaciente: (paciente: Paciente) => void;
  handleClickCancelar: () => void;
}

const BuscadorDePacientes: React.FC<ContainerProps> = ({ setPaciente, handleClickCancelar }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>();
  return <p>a</p>;
};

export default BuscadorDePacientes;
