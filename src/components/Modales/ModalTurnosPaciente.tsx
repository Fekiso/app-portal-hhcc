import React, { useEffect, useState } from "react";
import { DesplegableModel, Especialidades, Paciente, Turno, Usuario } from "../../interfaces";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import StyledButton from "../StyledButton/StyledButton";
import dayjs from "dayjs";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";
import axios from "axios";
import { useHistory } from "react-router";
import DialogoConfirmacion from "../DialogoConfirmacion/DialogoConfirmacion";
import CustomToast from "../CustomToast/CustomToast";

interface ContainerProps {
  usuarioLogueado: Usuario;
  paciente: Paciente;
  abrirModal: boolean;
  setAbrirModal: (abrir: boolean) => void;
}
const ModalTurnosPaciente: React.FC<ContainerProps> = ({
  usuarioLogueado,
  paciente,
  abrirModal,
  setAbrirModal,
}) => {
  const [tituloPagina, setTituloPagina] = useState("");
  const [especialidades, setEspecialidades] = useState<DesplegableModel[]>([]);
  const [prestadores, setPrestadores] = useState<DesplegableModel[]>([]);
  const [listadoTurnos, setListadoTurnos] = useState<Turno[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno>({
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
  });
  const [abrirModalCancelarReserva, setAbrirModalCancelarReserva] = useState(false);
  const [cancelados, setCancelados] = useState([
    { codigo: true, text: "Cancelados" },
    { codigo: false, text: "No cancelados" },
  ]);
  const [asistidos, setAsistidos] = useState([
    { codigo: false, text: "No asistidos" },
    { codigo: true, text: "Asistidos" },
  ]);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();
  const history = useHistory();

  const traerTurnosPaciente = async () => {
    let turnos = null;
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    try {
      const servicio = await axios.get(`${getUrlAxio()}Servicios`, config).then((response) => {
        if (response.data.length !== 0) {
          return response.data;
        } else {
          return null;
        }
      });
      if (servicio !== null) {
        const response = await axios.get(
          `${getUrlAxio()}Turnos/TurnosPaciente/?paciente=${paciente.codigo}&servicio=${
            servicio[0].codigo
          }`,
          config
        );
        if (response.data.length !== 0) {
          turnos = response.data;
        } else {
          turnos = null;
        }
        setListadoTurnos(turnos);
      }
    } catch (e) {
      mostrarNotificacion(
        true,
        "Ocurrió un problema al intentar consultar sus turnos registrados",
        "rojo"
      );
    }
  };

  const traerEspecialidades = async () => {
    let especialidades = null;
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    try {
      const response = await axios.get(`${getUrlAxio()}Especialidades`, config);
      if (response.data.length !== 0) {
        especialidades = response.data;
      } else {
        especialidades = null;
      }

      // especialidades = especialidades.filter((especialidad:Especialidades) => especialidad.vigente === true);

      especialidades = especialidades.map((especialidad: Especialidades) => {
        return {
          ...especialidad,
          text: especialidad.nombre,
        };
      });

      setEspecialidades(especialidades);
    } catch (e) {
      mostrarNotificacion(
        true,
        "Ocurrió un problema al intentar consultar las especialidades registradas",
        "rojo"
      );
    }
  };

  const traerPrestadores = async () => {
    let prestadores = null;

    try {
      prestadores = usuarioLogueado.prestadores;
      prestadores = prestadores.map((prestador) => {
        return {
          codigo: prestador.prestadorCod,
          text: prestador.prestadorNom,
          nota: prestador.especialidadNom,
        };
      });

      setPrestadores(prestadores);
    } catch (e) {
      mostrarNotificacion(
        true,
        "Ocurrió un problema al intentar consultar los/las prestadores/as registradas",
        "rojo"
      );
    }
  };

  useEffect(() => {
    try {
      traerTurnosPaciente();
      setTituloPagina(localStorage.getItem("nombreClinica") || "");
      document.title = localStorage.getItem("tituloWeb") || "";
    } catch (e) {
      history.push({ pathname: "/ErrorPage" });
    }
  }, []);

  useEffect(() => {
    try {
      traerTurnosPaciente();
      setTituloPagina(localStorage.getItem("nombreClinica") || "");
      document.title = localStorage.getItem("tituloWeb") || "";
    } catch (e) {
      history.push({ pathname: "/ErrorPage" });
    }
  }, [paciente]);

  const CancelarTurno = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
      };

      let servicio = null;
      const serviciosResponse = await axios.get(`${getUrlAxio()}Servicios`, config);

      if (serviciosResponse.data.length !== 0) {
        servicio = serviciosResponse.data[0];
      }

      if (servicio?.codigo !== null && turnoSeleccionado) {
        const cancelarTurnoResponse = await axios.patch(
          `${getUrlAxio()}Turnos/Quitar/${turnoSeleccionado.codigo}`,
          "",
          config
        );

        if (cancelarTurnoResponse.status === 200 && cancelarTurnoResponse.statusText === "OK") {
          mostrarNotificacion(true, "El turno se cancelo correctamente", "verde");
        } else {
          mostrarNotificacion(true, "Ocurrió un problema al intentar cancelar el turno", "rojo");
        }
      }
    } catch (error) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + error.response.data, "rojo");
    }
  };

  const togleAbrirCerrarCancelarReserva = () => {
    if (abrirModalCancelarReserva) {
      setTurnoSeleccionado({
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
      });
      // handleChangeSelect(-1, "Especialidad");
    }
    setAbrirModalCancelarReserva(!abrirModalCancelarReserva);
  };

  const handleClickSeleccionarTurno = (turno: Turno) => {
    setTurnoSeleccionado(turno);
    togleAbrirCerrarCancelarReserva();
  };

  const handleClickCancelarReserva = async () => {
    togleAbrirCerrarCancelarReserva();
    await CancelarTurno();
    await traerTurnosPaciente();
  };

  return (
    <IonModal isOpen={abrirModal} onDidDismiss={() => setAbrirModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Turnos del paciente</IonTitle>
          <StyledButton slot="end" fill="clear" expand="full" onClick={() => setAbrirModal(false)}>
            Cancelar
          </StyledButton>
        </IonToolbar>
      </IonHeader>
      {listadoTurnos.length <= 0 ? (
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <div className="ion-text-center">
                <small>No tiene turnos registrados</small>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      ) : (
        <>
          {/* Tabla */}
          <IonContent>
            <IonGrid>
              <IonList lines="none">
                <IonItem className="fila cabecera">
                  <IonCol className="celda cabecera" size="2.5">
                    <>Fecha</>
                  </IonCol>
                  <IonCol className="celda cabecera" size="3">
                    <>Prestador</>
                  </IonCol>
                  <IonCol className="celda cabecera" size="2">
                    <>Mutual</>
                  </IonCol>
                  <IonCol className="celda cabecera">
                    <>Asistido</>
                  </IonCol>
                  <IonCol className="celda cabecera">
                    <>Cancelado</>
                  </IonCol>
                  {/* <IonCol className="celda cabecera">
                    <p>Cancelar</p>
                  </IonCol> */}
                </IonItem>
                {listadoTurnos.map((fila) => (
                  <IonItem key={fila.codigo} className="fila">
                    <IonCol className="celda" size="2.5">
                      <small>{`${dayjs(fila.fecha).format("DD/MM/YYYY")} ${dayjs(fila.hora).format(
                        "HH:MM"
                      )}`}</small>
                    </IonCol>
                    <IonCol className="celda" size="3">
                      <>{fila.prestadorNom}</>
                    </IonCol>
                    <IonCol className="celda" size="2">
                      <small>{fila.mutualNom}</small>
                    </IonCol>
                    <IonCol className="celda">
                      <>{fila.asistio ? "Si" : "No"}</>
                    </IonCol>
                    {!fila.asistio ? (
                      <>
                        <IonCol className="celda">
                          <>{!fila.aCancelar && "Si"}</>
                        </IonCol>
                        {/* <IonCol className="celda">
                          {dayjs(fila.fecha).isAfter(dayjs()) && fila.aCancelar && (
                            // <div className="iconColumn">
                            <IonButton
                              shape="round"
                              fill="clear"
                              onClick={() => handleClickSeleccionarTurno(fila)}
                            >
                              <IonIcon
                                size="large"
                                aria-label="Cancelar turno"
                                ios={closeOutline}
                                md={close}
                              />
                            </IonButton>
                          )}
                        </IonCol> */}
                      </>
                    ) : (
                      <>
                        <IonCol className="celda" />
                        {/* <IonCol className="celda" /> */}
                      </>
                    )}
                  </IonItem>
                ))}
              </IonList>
            </IonGrid>
          </IonContent>

          <DialogoConfirmacion
            titulo="Cancelar turno"
            contenido={`Ha decidido cancelar el turno con el/la prestador/a ${
              turnoSeleccionado.prestadorNom
            }, con especialidad en ${turnoSeleccionado.especialidadNom}, para el dia ${dayjs(
              turnoSeleccionado.fecha
            ).format("DD/MM/YYYY")}, a las ${dayjs(turnoSeleccionado.hora).format(
              "HH:mm"
            )}, ¿Esta seguro/a de ello?`}
            abrirCerrarModal={abrirModalCancelarReserva}
            handleclickBotonNo={togleAbrirCerrarCancelarReserva}
            handleclickBotonSi={handleClickCancelarReserva}
            colorBotonNo="amarillo"
            colorBotonSi="rojo"
            textoBotonNo="No"
            textoBotonSi="Si"
          />

          <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />
        </>
      )}
    </IonModal>
  );
};

export default ModalTurnosPaciente;
