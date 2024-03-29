import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import CustomDesplegable from "../../components/CustomDesplegable/CustomDesplegable";
import { DesplegableModel, Prestador, Turno, Usuario } from "../../interfaces";
import dayjs from "dayjs";
import axios from "axios";
import useNotificacion from "../../hooks/notificacion";
import CustomToast from "../../components/CustomToast/CustomToast";
import StyledButton from "../../components/StyledButton/StyledButton";
import useUsuario from "../../hooks/usuarios";
import UseUrlAxio from "../../hooks/urlAxio";
import { useHistory } from "react-router";

interface ContainerProps {
  usuarioLogueado: Usuario;
}

const Agenda: React.FC<ContainerProps> = ({ usuarioLogueado }) => {
  const [prestadoresDesplegables, setPrestadoresDesplegable] = useState<DesplegableModel[]>([]);
  const [prestadorSeleccionado, setPrestadorSeleccionado] = useState<Prestador>({
    especialidadNom: "",
    prestadorCod: 0,
    prestadorNom: "",
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { recuperarSesion } = useUsuario();
  const { getUrlAxio } = UseUrlAxio();

  const history = useHistory();

  const listarPrestadores = () => {
    let listado: DesplegableModel[] = [];
    for (let i = 0; i < usuarioLogueado.prestadores.length; i++) {
      listado.push({
        codigo: usuarioLogueado.prestadores[i].prestadorCod,
        text: usuarioLogueado.prestadores[i].prestadorNom,
        nota: usuarioLogueado.prestadores[i].especialidadNom,
      });
    }
    setPrestadoresDesplegable(listado);
  };

  useEffect(() => {
    if (usuarioLogueado) {
      const prestadorLogueado: Prestador = {
        prestadorCod: usuarioLogueado.prestadorCod,
        prestadorNom: usuarioLogueado.prestadorNom,
        especialidadNom: usuarioLogueado.especialidadNom,
      };
      setPrestadorSeleccionado(prestadorLogueado);
      setFechaSeleccionada(dayjs().format("YYYY/MM/DD"));
      listarPrestadores();
      traerTurnosAgenda(prestadorLogueado, dayjs().format("YYYY/MM/DD"));
    } else history.push("/ErrorPage");
  }, []);

  const traerTurnosAgenda = async (prestador: Prestador, fecha: string) => {
    let turnos: Turno[];
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    try {
      if (prestadorSeleccionado !== null) {
        const response = await axios.get(
          `${getUrlAxio()}Turnos/TurnosPrestador/?prestador=${prestador.prestadorCod}&fecha=${dayjs(
            fecha
          ).format("YYYY/MM/DD")}`,
          config
        );
        if (response.data.length !== 0) {
          turnos = response.data;
        } else {
          turnos = [];
        }
        if (turnos.length > 0) setTurnos(turnos);
        else {
          mostrarNotificacion(
            true,
            "No hay turnos en la agenda para el prestador en este dia",
            "rojo"
          );
        }
      } else {
        mostrarNotificacion(
          true,
          "Debe seleccionar un prestador para poder cargar su agenda",
          "rojo"
        );
      }
    } catch (e) {
      mostrarNotificacion(
        true,
        "Ocurrió un problema al intentar consultar sus turnos registrados",
        "rojo"
      );
    }
  };

  const handleClickModificarFecha = (signo: string) => {
    // @ts-ignore
    let fecha = new dayjs(fechaSeleccionada);
    if (signo === "+") {
      fecha = dayjs(fecha).add(1, "days").format("YYYY-MM-DD");
    }

    if (signo === "-") {
      fecha = dayjs(fecha).subtract(1, "days").format("YYYY-MM-DD");
    }
    setFechaSeleccionada(fecha);
    traerTurnosAgenda(prestadorSeleccionado, fecha);
  };

  const handleChangePrestadorSelect = (value: number, id: string) => {
    let prestadorSelect: Prestador = {
      especialidadNom: "",
      prestadorCod: 0,
      prestadorNom: "",
    };

    usuarioLogueado.prestadores.forEach((prestador: Prestador) => {
      if (prestador.prestadorCod === value) {
        prestadorSelect = prestador;
      }
    });

    setPrestadorSeleccionado(prestadorSelect);
    traerTurnosAgenda(prestadorSelect, fechaSeleccionada);
  };

  const handleClickMostrarFichaPacienteTurnoSeleccionado = (turno: Turno) => {
    history.push("/portal/Paciente", { turno: turno });
  };

  const renderAgenda = () => {
    const mostrarAgenda = turnos.map((turno) => {
      return (
        <IonItem button onClick={() => handleClickMostrarFichaPacienteTurnoSeleccionado(turno)}>
          <IonCol>
            <StyledButton
              disabled
              className={
                turno.asistio === 0
                  ? turno.paciente !== 0
                    ? "gris text"
                    : "blanco text"
                  : turno.atendido
                  ? "rojo"
                  : dayjs(turno.atendidoHora).format("HH:mm") ===
                    dayjs("0001-01-01T00:00:00").format("HH:mm")
                  ? "azul text"
                  : "verde text"
              }
            >
              <small>
                {turno.asistio === 0
                  ? turno.paciente !== 0
                    ? "No asistio"
                    : "No asignado"
                  : turno.atendido
                  ? "Atendido"
                  : dayjs(turno.atendidoHora).format("HH:mm") ===
                    dayjs("0001-01-01T00:00:00").format("HH:mm")
                  ? "Asistio"
                  : "Siendo atendido"}
              </small>
            </StyledButton>
          </IonCol>
          <IonCol>
            <small>{dayjs(turno.hora).format("HH:mm")}</small>
          </IonCol>
          <IonCol>
            <small>{turno.pacienteNom ?? ""}</small>
          </IonCol>
          <IonCol>
            <small>
              {(turno.mutual === 0 ? "" : turno.mutual) +
                " - " +
                (turno.mutualNom === null ? "" : turno.mutualNom)}
            </small>
          </IonCol>
          <IonCol>
            <small>{turno.observaciones ?? ""}</small>
          </IonCol>
        </IonItem>
      );
    });
    return mostrarAgenda;
  };

  return (
    <IonGrid>
      <IonCard>
        <IonRow>
          <IonCol sizeXs="12" sizeMd="6">
            <IonItem>
              <IonInput
                readonly
                label="Prestador"
                label-placement="floating"
                // onKeyUp={(e) => documentoNro(e.target.value)}
                value={prestadorSeleccionado.prestadorNom}
              />
              <CustomDesplegable
                array={prestadoresDesplegables}
                handleChange={handleChangePrestadorSelect}
                id="Prestadores"
                mostrarSearch={true}
                mostrarTodos={false}
                value={prestadorSeleccionado.prestadorCod}
              />
            </IonItem>
          </IonCol>
          <IonCol sizeXs="12" sizeMd="6">
            <IonItem>
              <IonIcon
                icon={chevronBackOutline}
                onClick={() => handleClickModificarFecha("-")}
                slot="start"
              />
              <IonInput
                labelPlacement="stacked"
                label="Fecha:"
                type="date"
                value={dayjs(fechaSeleccionada).format("YYYY-MM-DD")}
                // onIonChange={(e) => setFechaNac(e.target.value)}
                // @ts-ignore
                min={dayjs(new dayjs()).subtract(110, "year").format("YYYY-MM-DD")}
                // @ts-ignore
                max={dayjs(new dayjs()).format("YYYY-MM-DD")}
                // className={`${errores.fechaNac && "ion-invalid"}`}
              />
              <IonIcon
                icon={chevronForwardOutline}
                onClick={() => handleClickModificarFecha("+")}
                slot="end"
              />
            </IonItem>
          </IonCol>
        </IonRow>
      </IonCard>
      {turnos.length > 0 && (
        <IonCard>
          <IonItem className="fila cabecera">
            <IonCol className="celda cabecera">
              <small>Estado</small>
            </IonCol>
            <IonCol className="celda cabecera">
              <small>Hora</small>
            </IonCol>
            <IonCol className="celda cabecera">
              <small>Paciente</small>
            </IonCol>
            <IonCol className="celda cabecera">
              <small>Mutual</small>
            </IonCol>
            <IonCol className="celda cabecera">
              <small>Observacion</small>
            </IonCol>
          </IonItem>
          <>{renderAgenda()}</>
        </IonCard>
      )}
      <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />
    </IonGrid>
  );
};

export default Agenda;
