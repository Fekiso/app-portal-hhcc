import React, { useState } from "react";
import { Paciente, Usuario } from "../../interfaces";
import { IonGrid, IonRow } from "@ionic/react";
import FichaPaciente from "../../components/FichaPaciente/FichaPaciente";
import useNotificacion from "../../hooks/notificacion";

interface ContainerProps {
  pacienteProps?: Paciente;
  usuarioLogueado?: Usuario;
}

const DarTurno: React.FC<ContainerProps> = ({ pacienteProps, usuarioLogueado }) => {
  const [paciente, setPaciente] = useState<Paciente>(
    pacienteProps || {
      codigo: 0,
      hc: 0,
      documentoNro: 0,
      documentoTipo: 0,
      documentoTipoNombre: "",
      nombre: "",
      apellido: "",
      mutual: 0,
      mutualNombre: "",
      telefono: "",
      celular: "",
      email: "",
      sexo: "",
      mutualAfiliado: "",
      nacimiento: "",
      password: "",
    }
  );
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  return (
    <IonGrid>
      <IonRow>
        <FichaPaciente
          pacienteProps={paciente}
          usuarioLogueado={usuarioLogueado}
          setPacienteProp={setPaciente}
        />
      </IonRow>
      <IonRow></IonRow>
    </IonGrid>
  );
};

export default DarTurno;
