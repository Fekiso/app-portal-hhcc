import React, { useEffect, useState } from "react";
import { Usuario, Turno, Evolucion, EstudioPaciente, EstudioLaboratorio } from "../../interfaces";
import { Paciente } from "../../interfaces";
import axios from "axios";
import dayjs from "dayjs";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";
import FichaPaciente from "../../components/FichaPaciente/FichaPaciente";
import {
  IonAccordion,
  IonAccordionGroup,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import StyledButton from "../../components/StyledButton/StyledButton";
import RtfEditor from "../../components/RtfEditor/RtfEditor";
import { documentText, documentTextOutline } from "ionicons/icons";
import EvolucionViewer from "../../components/EvolucionViewer/EvolucionViewer";
import ModalPedido from "../../components/Modales/ModalPedido";
import ModalTurnosPaciente from "../../components/Modales/ModalTurnosPaciente";
import DarTurno from "../DarTurno/DarTurno";
import ModalDarTurno from "../../components/Modales/ModalDarTurno";
import { useHistory, useLocation } from "react-router";

interface ContainerProps {
  usuarioLogueado: Usuario;
  turno?: Turno;
}

const HistoriaClinica: React.FC<ContainerProps> = ({ usuarioLogueado, turno }) => {
  const [paciente, setPaciente] = useState<Paciente>();
  const [evoluciones, setEvoluciones] = useState<Evolucion[]>([]);
  // const [estudiosLaboratorio, setEstudiosLaboratorio] = useState<EstudioLaboratorio[]>([]);
  // const [estudiosPaciente, setEstudiosPaciente] = useState<EstudioPaciente[]>([]);
  const [mostrarEvolucion, setMostrarEvolucion] = useState<Evolucion>();
  const [mostrarEvoSeleccionada, setMostrarEvoSeleccionada] = useState<boolean>();
  const [nuevaEvolucion, setNuevaEvolucion] = useState<Evolucion>();
  const [mostrarEvoNueva, setMostrarEvoNueva] = useState<boolean>();
  const [modalPedido, setModalPedido] = useState<boolean>(false);
  const [modalTurnos, setModalTurnos] = useState<boolean>(false);
  const [modalDarTurno, setModalDarTurno] = useState<boolean>(false);
  const [modalPdfs, setModalPdfs] = useState<boolean>(false);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();
  const location = useLocation();

  const traerPaciente = async (turno?: Turno) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
      };

      if (turno && !paciente /*si la variable es null o undefined entra*/) {
        const response = await axios.get(
          //@ts-ignore
          `${getUrlAxio()}pacientes/?documento=${turno?.pacienteDocumento}`,
          config
        );
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

          await traerEvolucionesPacientes(pacienteResponse);
          // await traerEstudiosPacientes(pacienteResponse);
          // await traerLaboratoriosPacientes(pacienteResponse);
        } else {
          mostrarNotificacion(true, "No se encuentra el paciente indicado", "amarillo");
        }
      } else {
        if (paciente) {
          await traerEvolucionesPacientes(paciente);
          // await traerEstudiosPacientes(paciente);
          // await traerLaboratoriosPacientes(paciente);
        }
      }
    } catch (e) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + e.response, "rojo");
    }
  };

  const traerEvolucionesPacientes = async (pacienteBuscar: Paciente) => {
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    if (pacienteBuscar?.codigo !== null) {
      try {
        const response = await axios.get(
          `${getUrlAxio()}Evoluciones/${pacienteBuscar?.codigo}`,
          config
        );
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

  // const traerLaboratoriosPacientes = async (pacienteBuscar: Paciente) => {
  //   const config = {
  //     headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
  //   };
  //   if (pacienteBuscar?.codigo !== null) {
  //     try {
  //       const response = await axios.get(
  //         `${getUrlAxio()}EstudiosLaboratorio/${pacienteBuscar?.codigo}`,
  //         config
  //       );
  //       let respLaboratorio = [];
  //       if (response.data.length > 0) {
  //         respLaboratorio = response.data;
  //       }
  //       setEstudiosLaboratorio(respLaboratorio);
  //     } catch (e) {
  //       //@ts-ignore
  //       mostrarNotificacion(true, "Error: " + e.response, "rojo");
  //     }
  //   }
  // };

  // const traerEstudiosPacientes = async (pacienteBuscar: Paciente) => {
  //   const config = {
  //     headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
  //   };
  //   if (pacienteBuscar?.codigo !== null) {
  //     try {
  //       const response = await axios.get(
  //         `${getUrlAxio()}EstudiosPacientes/${pacienteBuscar?.codigo}`,
  //         config
  //       );
  //       let respEstudio = [];
  //       if (response.data.length > 0) {
  //         respEstudio = response.data;
  //       }
  //       setEstudiosPaciente(respEstudio);
  //     } catch (e) {
  //       //@ts-ignore
  //       mostrarNotificacion(true, "Error: " + e.response, "rojo");
  //     }
  //   }
  // };

  useEffect(() => {
    //@ts-ignore
    let turnoProps: Turno = location.state.turno ||
      turno || {
        codigo: 0,
        fecha: "",
        hora: "",
        paciente: 0,
        equipoCod: 0,
        equipoNom: "",
        prestadorCod: 0,
        prestadorNom: "",
        estudio: 0,
        estudioNom: "",
        dioTurno: 0,
        mutual: 0,
        mutualNom: "",
        aCancelar: false,
        especialidad: 0,
        especialidadNom: "",
        libre: false,
        pacienteNom: "",
        pacienteDocumento: 0,
        asistio: 0,
        atendido: false,
        atendioFecha: "",
        atendioHora: "",
        atendidoHora: "",
        observaciones: "",
      };
    traerPaciente(turnoProps);
  }, [paciente]);

  const handleClickMostrarEvolucion = (evolucionSel: Evolucion) => {
    setMostrarEvolucion(evolucionSel);
    setMostrarEvoSeleccionada(true);
  };

  const renderEvolucionesPaciente = () => {
    return evoluciones.map((evolucion) => (
      <IonItem
        className="fila ion-align-items-start"
        key={evolucion.codigo}
        button
        onClick={() => handleClickMostrarEvolucion(evolucion)}
      >
        <IonIcon ios={documentTextOutline} md={documentText} size="large" slot="start" />
        <IonLabel>
          <small>{dayjs(evolucion.fecha).format("DD/MM/YYYY")}</small>
          <h6>{evolucion.prestadorNom}</h6>
        </IonLabel>
      </IonItem>
    ));
  };
  // const renderEstudiosPaciente = () => {
  //   return estudiosPaciente.map((estudio) => (
  //     <IonItem
  //       className="fila ion-align-items-center"
  //       key={estudio.codigo}
  //       // onClick={(e) => handleClickSeleccionarPaciente(paciente)}
  //     >
  //       <IonCol className="celda" size="3">
  //         <p>{dayjs(estudio.fecha).format("DD/MM/YYYY")}</p>
  //       </IonCol>
  //       <IonCol className="celda" size="9">
  //         <p>{estudio.prestadorNom}</p>
  //       </IonCol>
  //     </IonItem>
  //   ));
  // };
  // const renderEstudiosLaboratorio = () => {
  //   return estudiosLaboratorio.map((estudio) => (
  //     <IonItem
  //       className="fila ion-align-items-center"
  //       key={estudio.codigo}
  //       // onClick={(e) => handleClickSeleccionarPaciente(paciente)}
  //     >
  //       <IonCol className="celda" size="3">
  //         <p>{dayjs(estudio.fecha).format("DD/MM/YYYY")}</p>
  //       </IonCol>
  //       <IonCol className="celda" size="9">
  //         <p>{estudio.prestadorNom}</p>
  //       </IonCol>
  //     </IonItem>
  //   ));
  // };

  const handleClickMostrarModal = (id: string): void => {
    switch (id) {
      case "pedido":
        setModalPedido(true);
        break;
      case "turnos":
        setModalTurnos(true);
        break;
      case "darTurno":
        setModalDarTurno(true);
        break;
      case "pdfs":
        setModalPedido(true);
        break;
      default:
        mostrarNotificacion(true, "Seleccion inválida", "rojo");
        break;
    }
  };
  return (
    <IonGrid>
      <FichaPaciente usuarioLogueado={usuarioLogueado} setPacienteProp={setPaciente} />
      {paciente && (
        <>
          <IonCard>
            <IonCardContent>
              <IonRow className="ion-align-items-center">
                <IonCol sizeXs="6" sizeMd="3">
                  <StyledButton expand="block" onClick={() => handleClickMostrarModal("darTurno")}>
                    Nuevo Turno
                  </StyledButton>
                </IonCol>
                <IonCol sizeXs="6" sizeMd="3">
                  <StyledButton expand="block" onClick={() => handleClickMostrarModal("turnos")}>
                    Historial de turnos
                  </StyledButton>
                </IonCol>
                <IonCol sizeXs="6" sizeMd="3">
                  <StyledButton expand="block" onClick={() => handleClickMostrarModal("pdfs")}>
                    Pdfs Paciente
                  </StyledButton>
                </IonCol>
                <IonCol sizeXs="6" sizeMd="3">
                  <StyledButton expand="block" onClick={() => handleClickMostrarModal("pedido")}>
                    Nuevo Pedido
                  </StyledButton>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
          {evoluciones.length > 0 && (
            // || estudiosPaciente.length > 0 || estudiosLaboratorio.length > 0
            <IonCard>
              <IonRow>
                <IonCol sizeXs="12" sizeMd="4">
                  <IonCardContent>
                    <IonAccordionGroup>
                      {evoluciones.length > 0 && (
                        <IonAccordion value="Evoluciones">
                          <IonItem slot="header" color="light">
                            <IonLabel>Evoluciones</IonLabel>
                          </IonItem>
                          <IonList className="ion-padding" slot="content">
                            {renderEvolucionesPaciente()}
                          </IonList>
                        </IonAccordion>
                      )}
                      {/* {estudiosPaciente.length > 0 && (
                    <IonAccordion value="Estudios">
                      <IonItem slot="header" color="light">
                        <IonLabel>Estudios</IonLabel>
                      </IonItem>
                      <IonList className="ion-padding" slot="content">
                        {renderEstudiosPaciente()}
                      </IonList>
                    </IonAccordion>
                  )}
                  {estudiosLaboratorio.length > 0 && (
                    <IonAccordion value="Laboratorio">
                      <IonItem slot="header" color="light">
                        <IonLabel>Laboratorio</IonLabel>
                      </IonItem>
                      <IonList className="ion-padding" slot="content">
                        {renderEstudiosLaboratorio()}
                      </IonList>
                    </IonAccordion>
                  )} */}
                    </IonAccordionGroup>
                  </IonCardContent>
                </IonCol>
                <IonCol sizeXs="12" sizeMd="8">
                  {mostrarEvoSeleccionada && (
                    <EvolucionViewer
                      usuarioLogueado={usuarioLogueado}
                      paciente={paciente}
                      evolucionSel={mostrarEvolucion}
                      setVisible={setMostrarEvoSeleccionada}
                    />
                  )}
                </IonCol>
              </IonRow>
            </IonCard>
          )}
        </>
      )}

      <ModalPedido
        abrirModal={modalPedido}
        setAbrirModal={setModalPedido}
        usuarioLogueado={usuarioLogueado}
        //@ts-ignore
        paciente={paciente}
      />

      <ModalTurnosPaciente
        abrirModal={modalTurnos}
        setAbrirModal={setModalTurnos}
        usuarioLogueado={usuarioLogueado}
        //@ts-ignore
        paciente={paciente}
      />

      <ModalDarTurno
        usuarioLogueado={usuarioLogueado}
        pacienteProps={paciente}
        abrirModal={modalDarTurno}
        setAbrirModal={setModalDarTurno}
      />
    </IonGrid>
  );
};

export default HistoriaClinica;
