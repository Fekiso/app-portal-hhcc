import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { radioButtonOffOutline, radioButtonOnOutline, search, searchOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DesplegableModel, Paciente } from "../../interfaces";
import StyledButton from "../StyledButton/StyledButton";
import useNotificacion from "../../hooks/notificacion";

interface ContainerProps {
  //   array: DesplegableModel[];
  //   mostrarTodos: boolean;
  //   mostrarSearch: boolean;
  //   id: string;
  //   value: number;
  //   handleChange: (value: number, id: string) => void;
}
const BuscadorPacientes: React.FC<ContainerProps> = ({}) => {
  // const [open, setOpen] = useState(false);
  // const [texto, setTexto] = useState("");
  const [buscarPor, setBuscarPor] = useState("Nombre");
  const [searchText, setSearchText] = useState("");
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const [pacientesCoinciden, setPacientesCoinciden] = useState<Paciente[]>([]);

  // const onHandleChange = (value: number, textLabel: string) => {
  // handleChange(value, id);
  //   setTexto(textLabel);
  //   setOpen(false);
  // };

  // const FiltrarOpciones = (ev: any) => {
  //   const texto = ev.target.value;
  // let opciones: DesplegableModel[] = array.filter((item: DesplegableModel) =>
  //   item.text.toLowerCase().includes(texto.toLowerCase())
  // );
  // setOpcionesValidas(opciones);
  //   setOpcionesValidas([]);
  //   setSearchText(texto);
  // };

  const handleClickBuscar = () => {
    // let pacienteModificado = { ...paciente };

    switch (buscarPor) {
      case "HC":
        break;
      case "Documento":
        break;
      case "Nombre":
        break;
      default:
        mostrarNotificacion(true, "Selección inválida de ", "rojo");
        break;
    }
    // setPaciente(pacienteModificado);
  };

  // useEffect(() => {
  //   if (open) {
  //     setOpcionesValidas(array);
  //   }
  //   if (texto === "" || (value === -1 && !mostrarTodos)) {
  //     // setTexto("Seleccione una opcion");
  //   }
  // }, [open]);

  const renderPacientes = () => {
    const mostrarAgenda = pacientesCoinciden.map((paciente) => {
      return (
        <IonItem className="fila ion-text-start">
          <IonCol className="celda">
            <p>{paciente.hc}</p>
          </IonCol>
          <IonCol className="celda">
            <p>{paciente.apellido}</p>
          </IonCol>
          <IonCol className="celda">
            <p>{paciente.nombre}</p>
          </IonCol>
          <IonCol className="celda">
            <p>{paciente.mutualNombre}</p>
          </IonCol>
          <IonCol className="celda">
            <p>{paciente.mutualAfiliado}</p>
          </IonCol>
        </IonItem>
      );
    });
    return mostrarAgenda;
  };

  return (
    <IonCard>
      <IonCardContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol sizeXs="12" sizeMd="3">
              <IonSelect
                label="Buscar por"
                labelPlacement="floating"
                interface="popover"
                value={buscarPor}
                // placeholder="Indique segun que va a buscar al paciente"
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
                // @ts-ignore
                onKeyUp={(e) => setSearchText(e.target.value)}
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
          <IonList>
            <IonItem className="fila ion-align-items-center">
              <IonCol>
                <IonTitle>HC</IonTitle>
              </IonCol>
              <IonCol>
                <IonTitle>Apellido</IonTitle>
              </IonCol>
              <IonCol>
                <IonTitle>Nombre</IonTitle>
              </IonCol>
              <IonCol>
                <IonTitle>Mutual</IonTitle>
              </IonCol>
              <IonCol>
                <IonTitle>Nro afiliado</IonTitle>
              </IonCol>
              {renderPacientes()}
            </IonItem>
          </IonList>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default BuscadorPacientes;
