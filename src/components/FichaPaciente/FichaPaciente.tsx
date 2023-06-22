import React, { useState } from "react";
import { Paciente, Usuario } from "../../interfaces";
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import useNotificacion from "../../hooks/notificacion";
import axios from "axios";
import StyledButton from "../StyledButton/StyledButton";
import { searchOutline } from "ionicons/icons";
import dayjs from "dayjs";
import TabsEstudios from "../TabsEstudios/TabsEstudios";

interface ContainerProps {
  pacienteProps?: Paciente;
  usuarioLogueado?: Usuario;
  setPacienteProp: (paciente: Paciente) => void;
}
const FichaPaciente: React.FC<ContainerProps> = ({
  pacienteProps,
  usuarioLogueado,
  setPacienteProp,
}) => {
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
  const [buscarPor, setBuscarPor] = useState("Nombre");
  const [searchText, setSearchText] = useState("");
  const [pacientesCoinciden, setPacientesCoinciden] = useState<Paciente[]>([]);
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();

  const buscarPacientes = async (buscaHC: boolean) => {
    try {
      const urlAxios = localStorage.getItem("urlAxio") || "";
      const config = { headers: { Authorization: `Bearer ${usuarioLogueado?.token}` } };
      let response;
      if (buscaHC) {
        response = await axios.get(`${urlAxios}pacientes/?documento=${searchText}`, config);
      } else {
        response = await axios.get(`${urlAxios}pacientes/?nombre=${searchText}`, config);
      }
      if (Array.isArray(response.data) && response.data.length !== 0) {
        setPacientesCoinciden(response.data);
      } else {
        mostrarNotificacion(true, "No se encontraron coincidencias", "amarillo");
      }
    } catch (e) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + e.response.message, "rojo");
    }
  };

  const handleClickBuscar = () => {
    if (searchText.length >= 4) {
      switch (buscarPor) {
        case "HC":
        case "Documento":
          buscarPacientes(true);
          break;
        case "Nombre":
          buscarPacientes(false);
          break;
        default:
          mostrarNotificacion(true, "Selección inválida", "rojo");
          break;
      }
    } else {
      mostrarNotificacion(true, "Debe ingresar al menos 4 caracteres", "amarillo");
    }
  };

  const handleClickSeleccionarPaciente = (paciente: Paciente) => {
    setPaciente(paciente);
    setPacienteProp(paciente);
  };

  const renderPacientes = () => {
    return pacientesCoinciden.map((paciente) => (
      <IonItem
        className="fila ion-align-items-center"
        key={paciente.codigo}
        onClick={(e) => handleClickSeleccionarPaciente(paciente)}
      >
        <IonCol className="celda" size="3">
          <small>{paciente.hc}</small>
        </IonCol>
        <IonCol className="celda" size="3">
          <small>
            {paciente.apellido}, {paciente.nombre}
          </small>
        </IonCol>
        <IonCol className="celda" size="3">
          <small>{paciente.mutualNombre}</small>
        </IonCol>
        <IonCol className="celda" size="3">
          <small>{paciente.mutualAfiliado === null ? "-" : paciente.mutualAfiliado}</small>
        </IonCol>
      </IonItem>
    ));
  };

  return (
    <IonCard>
      <IonGrid>
        {paciente.codigo !== 0 ? (
          <IonCardContent>
            <IonRow className="ion-text-start">
              <IonCol className="ion-text-start">
                <h2>
                  Paciente: {paciente.apellido}, {paciente.nombre}
                </h2>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-start">
                <IonLabel>Documento: {paciente.documentoNro}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-start">
                <IonLabel>Edad: {dayjs().diff(paciente.nacimiento, "year")}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-start">
                <IonLabel>Fecha Nacimiento: {paciente.nacimiento}</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-start">
                <IonLabel>Mutual: {paciente.mutualNombre}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-start">
                <IonLabel>
                  Nro Afiliado: {paciente.mutualAfiliado === null ? "-" : paciente.mutualAfiliado}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-start">
                <IonLabel>Celular:{paciente.celular}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-start">
                <IonLabel>Telefono: {paciente.telefono}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-start">
                <IonLabel>Correo: {paciente.email}</IonLabel>
              </IonCol>
            </IonRow>
          </IonCardContent>
        ) : (
          <IonCardContent className="ion-padding">
            <IonGrid>
              <IonRow className="ion-align-items-center">
                <IonCol sizeXs="12" sizeMd="3">
                  <IonSelect
                    label="Buscar paciente segun "
                    labelPlacement="floating"
                    interface="popover"
                    value={buscarPor}
                    onIonChange={(e) => setBuscarPor(e.detail.value)}
                  >
                    <IonSelectOption value="HC">HC</IonSelectOption>
                    <IonSelectOption value="Documento">Documento</IonSelectOption>
                    <IonSelectOption value="Nombre">Nombre y/o apellido</IonSelectOption>
                  </IonSelect>
                </IonCol>
                <IonCol sizeXs="12" sizeMd="7">
                  <IonSearchbar
                    value={searchText}
                    debounce={500}
                    placeholder={`Buscar por ${buscarPor}`}
                    onIonChange={(e) => setSearchText(e.detail.value!)}
                  />
                </IonCol>
                <IonCol sizeXs="12" sizeMd="2">
                  <StyledButton onClick={handleClickBuscar} expand="block" className="azul">
                    <IonIcon icon={searchOutline} />
                    <IonLabel>Buscar</IonLabel>
                  </StyledButton>
                </IonCol>
              </IonRow>
              <br />
              {pacientesCoinciden.length > 0 && (
                <IonList>
                  <IonItem className="fila ion-align-items-center">
                    <IonCol className="celda" size="3">
                      <IonTitle>HC</IonTitle>
                    </IonCol>
                    <IonCol className="celda" size="3">
                      <IonTitle>Nombre</IonTitle>
                    </IonCol>
                    <IonCol className="celda" size="3">
                      <IonTitle>Mutual</IonTitle>
                    </IonCol>
                    <IonCol className="celda" size="3">
                      <IonTitle>Nro afiliado</IonTitle>
                    </IonCol>
                  </IonItem>
                  {renderPacientes()}
                </IonList>
              )}
            </IonGrid>
          </IonCardContent>
        )}
      </IonGrid>
    </IonCard>
  );
};

export default FichaPaciente;
