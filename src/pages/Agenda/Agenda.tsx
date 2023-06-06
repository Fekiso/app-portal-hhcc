import {
  IonButton,
  IonCard,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import React, { ReactNode, useEffect, useState } from "react";
import CustomDesplegable from "../../components/CustomDesplegable/CustomDesplegable";
import { DesplegableModel, Prestador, Turno, Usuario } from "../../interfaces";
import dayjs from "dayjs";
import axios from "axios";
import useNotificacion from "../../hooks/notificacion";
import CustomToast from "../../components/CustomToast/CustomToast";
import StyledButton from "../../components/StyledButton/StyledButton";

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
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(dayjs().toString());
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();

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
    const prestadorLogueado: Prestador = {
      prestadorCod: usuarioLogueado.prestadorCod,
      prestadorNom: usuarioLogueado.prestadorNom,
      especialidadNom: usuarioLogueado.especialidadNom,
    };
    setPrestadorSeleccionado(prestadorLogueado);
    setFechaSeleccionada(dayjs().format("YYYY/MM/DD"));
    listarPrestadores();
    traerTurnosAgenda(prestadorLogueado, dayjs().format("YYYY/MM/DD"));
  }, []);

  // useEffect(() => {
  //   console.log(mostrar);
  // }, [mostrar]);

  const traerTurnosAgenda = async (prestador: Prestador, fecha: string) => {
    let turnos: Turno[];
    const urlAxios = localStorage.getItem("urlAxio");
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    try {
      if (prestadorSeleccionado !== null) {
        const response = await axios.get(
          `${urlAxios}Turnos/TurnosPrestador/?prestador=${prestador.prestadorCod}&fecha=${dayjs(
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
    let fecha = new dayjs();
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

  const renderAgenda = () => {
    const mostrarAgenda = turnos.map((turno) => {
      return (
        <IonItem className="fila ion-text-start" disabled={turno.paciente === 0}>
          <IonCol className="celda">
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
            </StyledButton>
          </IonCol>
          <IonCol className="celda">
            <p>{dayjs(turno.hora).format("HH:mm")}</p>
          </IonCol>
          <IonCol className="celda">
            <p>{turno.pacienteNom ?? ""}</p>
          </IonCol>
          <IonCol className="celda">
            <p>
              {(turno.mutual === 0 ? "" : turno.mutual) +
                " - " +
                (turno.mutualNom === null ? "" : turno.mutualNom)}
            </p>
          </IonCol>
          <IonCol className="celda">
            <p>{turno.observaciones ?? ""}</p>
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
            <IonItem lines="none">
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
            <IonItem lines="none">
              <IonIcon
                icon={chevronBackOutline}
                onClick={() => handleClickModificarFecha("-")}
                slot="start"
              />
              <IonInput
                labelPlacement="stacked"
                label="Fecha:"
                type="date"
                // value={new Date()}
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
          <IonList lines="none">
            <IonGrid>
              <IonItem className="fila cabecera">
                <IonCol className="celda cabecera">
                  <p>Estado</p>
                </IonCol>
                <IonCol className="celda cabecera">
                  <p>Hora</p>
                </IonCol>
                <IonCol className="celda cabecera">
                  <p>Paciente</p>
                </IonCol>
                <IonCol className="celda cabecera">
                  <p>Mutual</p>
                </IonCol>
                <IonCol className="celda cabecera">
                  <p>Observacion</p>
                </IonCol>
              </IonItem>
              <>{renderAgenda()}</>
            </IonGrid>
          </IonList>
        </IonCard>
      )}
      <CustomToast mostrar={mostrar} mensaje={mensaje} color={color} />
    </IonGrid>
  );
};

export default Agenda;
