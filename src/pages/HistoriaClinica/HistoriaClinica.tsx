import React, { useState } from "react";
import { Usuario, Turno, Evolucion, EstudioPaciente, EstudioLaboratorio } from "../../interfaces";
import { Paciente } from "../../interfaces";
import axios from "axios";
import dayjs from "dayjs";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";

interface ContainerProps {
  usuarioLogueado: Usuario;
  turno?: Turno;
}

const HistoriaClinica: React.FC<ContainerProps> = ({ usuarioLogueado, turno }) => {
  const [paciente, setPaciente] = useState<Paciente>();
  const [evoluciones, setEvoluciones] = useState<Evolucion[]>([]);
  const [estudiosLaboratorio, setEstudiosLaboratorio] = useState<EstudioLaboratorio[]>([]);
  const [estudiosPaciente, setEstudiosPaciente] = useState<EstudioPaciente[]>([]);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();

  const traerPacientes = async (dni: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
      };
      if (paciente ?? true /*si la variable es null o undefined entra*/) {
        const response = await axios.get(`${getUrlAxio()}pacientes/?documento=${dni}`, config);
        if (response.data.length !== 0) {
          let pacienteResponse: Paciente = {
            codigo: response.data[0].codigo ?? "",
            hc: response.data[0].hc ?? "",
            documentoNro: response.data[0].documentoNro ?? "",
            documentoTipo: response.data[0].documentoTipo ?? "",
            documentoTipoNombre: response.data[0].documentoTipoNombre ?? "",
            nombre: response.data[0].nombre ?? "",
            apellido: response.data[0].apellido ?? "",
            mutual: response.data[0].mutual ?? "",
            mutualNombre: response.data[0].mutualNombre ?? "",
            telefono: response.data[0].telefono ?? "",
            celular: response.data[0].celular ?? "",
            email: response.data[0].email ?? "",
            sexo: response.data[0].sexo ?? "",
            mutualAfiliado: response.data[0].mutualAfiliado ?? "",
            nacimiento: response.data[0].nacimiento ?? "",
            password: response.data[0].password ?? "",
          };
          setPaciente(pacienteResponse);

          await traerEvolucionesPacientes();
          await traerEstudiosPacientes();
          await traerLaboratoriosPacientes();
        } else {
          mostrarNotificacion(true, "No se encuentra el paciente indicado", "amarillo");
        }
      } else {
        await traerEvolucionesPacientes();
        await traerEstudiosPacientes();
        await traerLaboratoriosPacientes();
      }
    } catch (e) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + e.response, "rojo");
    }
  };

  const traerEvolucionesPacientes = async () => {
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    if (paciente?.codigo !== null) {
      try {
        const response = await axios.get(`${getUrlAxio()}Evoluciones/${paciente?.codigo}`, config);
        let respEvoluciones = [];
        if (response.data.length > 0) {
          respEvoluciones = response.data;
        }
        setEvoluciones(respEvoluciones);
      } catch (e) {
        //@ts-ignore
        mostrarNotificacion(true, "Error: " + e.response, "rojo");
      }
    }
  };

  const traerLaboratoriosPacientes = async () => {
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };
    if (paciente?.codigo !== null) {
      try {
        const response = await axios.get(
          `${getUrlAxio()}EstudiosLaboratorio/${paciente?.codigo}`,
          config
        );
        let respLaboratorio = [];
        if (response.data.length > 0) {
          respLaboratorio = response.data;
        }
        setEstudiosLaboratorio(respLaboratorio);
      } catch (e) {
        //@ts-ignore
        mostrarNotificacion(true, "Error: " + e.response, "rojo");
      }
    }
  };

  const traerEstudiosPacientes = async () => {
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };
    if (paciente?.codigo !== null) {
      try {
        const response = await axios.get(
          `${getUrlAxio()}EstudiosPacientes/${paciente?.codigo}`,
          config
        );
        let respEstudio = [];
        if (response.data.length > 0) {
          respEstudio = response.data;
        }
        setEstudiosPaciente(respEstudio);
      } catch (e) {
        //@ts-ignore
        mostrarNotificacion(true, "Error: " + e.response, "rojo");
      }
    }
  };
  return <div>HistoriaHlinica</div>;
};

export default HistoriaClinica;
