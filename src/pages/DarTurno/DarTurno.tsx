import React, { useEffect, useState } from "react";
import {
  DesplegableModel,
  Especialidades,
  Paciente,
  Prestador,
  Turno,
  Usuario,
} from "../../interfaces";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import FichaPaciente from "../../components/FichaPaciente/FichaPaciente";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";
import axios, { AxiosResponse } from "axios";
import CustomDesplegable from "../../components/CustomDesplegable/CustomDesplegable";
import dayjs from "dayjs";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import StyledButton from "../../components/StyledButton/StyledButton";

interface ContainerProps {
  pacienteProps?: Paciente;
  usuarioLogueado: Usuario;
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
  const [especialidades, setEspecialidades] = useState<DesplegableModel[]>([]);
  const [prestadores, setPrestadores] = useState<DesplegableModel[]>([]);
  const [listadoPrestadores, setListadoPrestadores] = useState<DesplegableModel[]>([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<Especialidades>({
    codigo: 0,
    nombre: "",
  });
  const [prestadorSeleccionado, setPrestadorSeleccionado] = useState<Prestador>({
    prestadorCod: 0,
    prestadorNom: "",
    especialidadNom: "",
  });
  const [fechaSelect, setFechaSelect] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [observaciones, setObservaciones] = useState<string>("");
  const [turnosAgenda, setTurnosAgenda] = useState<Turno[]>([]);
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
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();

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
          codigo: especialidad.codigo,
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

  const verificarFecha = async (fecha: string) => {
    var config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };
    if (fecha !== "" && fecha !== null) {
      await axios
        .get(`${getUrlAxio()}Servicios/TraerFeriado?fecha=${fecha}`, config)
        .then((response) => {
          if (response.data.length !== 0) {
            if (response.data[0].esFeriado) {
              mostrarNotificacion(true, "Este dia es Feriado", "amarillo");
            }
          }
        })
        .catch((e) => {
          console.log("Error");
          console.log(e.response);
        });
    }
  };
  const traerTurnosAgenda = async (prestador: Prestador, fecha: string) => {
    let agenda: Turno[] = [];

    verificarFecha(fecha);

    var config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };
    if (prestador) {
      try {
        const response: AxiosResponse = await axios.get(
          `${getUrlAxio()}Turnos/TurnosPrestador/?prestador=${
            usuarioLogueado.prestadorCod
          }&fecha=${dayjs(fecha).format("YYYY/MM/DD")}`,
          config
        );
        if (response.data.length !== 0) {
          agenda = response.data;
        }
      } catch (e) {
        mostrarNotificacion(
          true,
          //@ts-ignore
          "Error: " + e.response,
          "rojo"
        );
      }

      if (agenda === null) {
        mostrarNotificacion(true, "No hay turnos disponibles para el prestador este dia", "rojo");
      }
      setTurnosAgenda(agenda);
    }
  };

  useEffect(() => {
    traerEspecialidades();
    traerPrestadores();
    handleChangeSelect(-1, "especialidad");
  }, [usuarioLogueado, paciente]);

  const handleChangeSelect = (value: number, select: string) => {
    console.log(value, select);
    switch (select) {
      case "especialidad":
        let especialidadSel: Especialidades = { codigo: 0, nombre: "" };
        especialidades.forEach((especialidad: DesplegableModel) => {
          if (especialidad.codigo === value) {
            especialidadSel.codigo = especialidad.codigo;
            especialidadSel.nombre = especialidad.text;
          }
        });
        if (value !== -1) {
          setListadoPrestadores(
            prestadores.filter((prestador) => prestador.nota === especialidadSel.nombre)
          );
        } else {
          setListadoPrestadores(prestadores);
          setPrestadorSeleccionado({ prestadorCod: -1, prestadorNom: "", especialidadNom: "" });
        }
        setEspecialidadSeleccionada(especialidadSel);
        break;
      case "Prestador":
        let prestadorSel: Prestador = { prestadorCod: 0, prestadorNom: "", especialidadNom: "" };
        prestadores.forEach((prestador) => {
          if (prestador.codigo === value) {
            //@ts-ignore
            handleChangeSelect(prestador.nota, "Especialidad");
            prestadorSel = {
              prestadorCod: prestador.codigo,
              prestadorNom: prestador.text,
              especialidadNom: prestador.nota || "",
            };
          }
        });
        setPrestadorSeleccionado(prestadorSel);
        traerTurnosAgenda(prestadorSel, fechaSelect);
        break;
      default:
        mostrarNotificacion(true, "Seleccion invalida", "rojo");
        break;
    }
  };

  const handleClickModificarFecha = (signo: string) => {
    let fecha = fechaSelect;
    if (signo === "+") {
      fecha = dayjs(fecha).add(1, "days").format("YYYY-MM-DD");
    }
    if (signo === "-") {
      fecha = dayjs(fecha).subtract(1, "days").format("YYYY-MM-DD");
    }

    traerTurnosAgenda(prestadorSeleccionado, fecha);
    setFechaSelect(fecha);
  };

  const seleccionarTurno = (turno: Turno) => {
    if (paciente) {
      mostrarNotificacion(true, "Debe ingresar un paciente", "rojo");
    } else {
      if (turno.prestadorCod !== 0) {
        mostrarNotificacion(true, "Turno ya asignado a otro paciente", "rojo");
      } else {
        console.log("MostrarTurno a dar");
      }
    }
  };

  const actualizarTurno = async () => {
    let actualizarTurnoEstado = 0;
    let url = `${getUrlAxio}Turnos/DarTurno/${turnoSeleccionado.codigo}`;

    let respuesta = "";
    let errorAxios = "";
    let blnErrorAxios = false;

    var config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };
    if (turnoSeleccionado) {
      try {
        const response: AxiosResponse = await axios.put(
          url,
          {
            codigo: turnoSeleccionado.codigo, //Codigo Turno
            paciente: paciente.codigo, //Codigo Paciente
            estudio: null, // si es estudio, codigo Estudio, sino Null
            mutual: paciente.mutual, //codigo Mutual
            dioturno: usuarioLogueado.codigo, // Codigo Usuario
            observaciones: observaciones,
          },
          config
        );
        actualizarTurnoEstado = response.status;
        respuesta = response.statusText;
      } catch (error) {
        //@ts-ignore
        errorAxios = error.response.data.message;
        blnErrorAxios = true;
      }

      if (!blnErrorAxios) {
        if (actualizarTurnoEstado === 200 && respuesta === "OK") {
          mostrarNotificacion(true, "El turno se Registro Correctamente", "verde");
        } else {
          mostrarNotificacion(true, respuesta, "rojo");
        }
      } else {
        mostrarNotificacion(true, errorAxios, "rojo");
      }
    } else {
      mostrarNotificacion(true, errorAxios, "rojo");
    }
  };

  const renderTurnos = () => {
    return turnosAgenda.map((turno: Turno) => (
      <IonItem
        className="fila ion-align-items-center"
        key={turno.codigo}
        onClick={(e) => seleccionarTurno(turno)}
      >
        <IonCol className="celda" size="3">
          <small>{dayjs(turno.hora).format("HH:MM")}</small>
        </IonCol>
        <IonCol className="celda" size="3">
          <small>{turno.pacienteNom}</small>
        </IonCol>
        <IonCol className="celda" size="6">
          <small>{turno.observaciones}</small>
        </IonCol>
      </IonItem>
    ));
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonRow>
          <IonCol size="12">
            <FichaPaciente
              pacienteProps={paciente}
              usuarioLogueado={usuarioLogueado}
              setPacienteProp={setPaciente}
            />
          </IonCol>
        </IonRow>
        {paciente.codigo !== 0 && (
          <>
            <IonRow>
              <IonCol sizeXs="12" size-md="6">
                <IonItem>
                  <IonInput
                    readonly
                    label="Especialidad"
                    label-placement="floating"
                    id="especialidadNombre"
                    value={especialidadSeleccionada.nombre}
                    // className={`${erroresPaciente.mutualNombre && "ion-invalid"}`}
                  />
                  <CustomDesplegable
                    array={especialidades}
                    value={especialidadSeleccionada.codigo}
                    handleChange={handleChangeSelect}
                    mostrarTodos={true}
                    mostrarSearch={true}
                    id="especialidad"
                  />
                </IonItem>
              </IonCol>

              <IonCol sizeXs="12" size-md="6">
                <IonItem>
                  <IonInput
                    readonly
                    label="Prestador"
                    label-placement="floating"
                    id="prestador"
                    value={prestadorSeleccionado.prestadorNom}
                    // className={`${erroresPaciente.mutualNombre && "ion-invalid"}`}
                  />
                  <CustomDesplegable
                    array={listadoPrestadores}
                    value={prestadorSeleccionado.prestadorCod}
                    handleChange={handleChangeSelect}
                    mostrarTodos={false}
                    mostrarSearch={true}
                    id="Prestador"
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonItem>
                  <IonIcon
                    icon={chevronBackOutline}
                    size="large"
                    slot="start"
                    onClick={() => handleClickModificarFecha("-")}
                  />
                  <IonInput
                    type="date"
                    label="Fecha"
                    label-placement="floating"
                    id="fecha"
                    value={fechaSelect}
                    //@ts-ignore
                    // onClick={(e) => setFechaSelect(dayjs(e.target.value).format("YYYY-MM-DD"))}
                    onClick={(e) => console.log(dayjs(e.target.value).format("YYYY-MM-DD"))}
                  />
                  <IonIcon
                    icon={chevronForwardOutline}
                    size="large"
                    slot="end"
                    onClick={() => handleClickModificarFecha("+")}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            {turnosAgenda.length > 0 && (
              <IonRow>
                <IonCol size="12">
                  <IonList>
                    <IonItem className="fila ion-align-items-center">
                      <IonCol className="celda" size="3">
                        <small>Hora</small>
                      </IonCol>
                      <IonCol className="celda" size="3">
                        <small>Paciente</small>
                      </IonCol>
                      <IonCol className="celda" size="6">
                        <small>Observacion</small>
                      </IonCol>
                    </IonItem>
                    {renderTurnos()}
                  </IonList>
                </IonCol>
              </IonRow>
            )}
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default DarTurno;
