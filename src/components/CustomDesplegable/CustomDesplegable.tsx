import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { radioButtonOffOutline, radioButtonOnOutline, search, searchOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DesplegableModel } from "../../interfaces";
import StyledButton from "../StyledButton/StyledButton";
// import StyledButton from "../StyledButton/StyledButton";

interface ContainerProps {
  array: DesplegableModel[];
  mostrarTodos: boolean;
  mostrarSearch: boolean;
  id: string;
  value: number;
  handleChange: (value: number, id: string) => void;
}
const CustomDesplegable: React.FC<ContainerProps> = ({
  array,
  mostrarTodos,
  mostrarSearch,
  id,
  value,
  handleChange,
}) => {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [searchText, setSearchText] = useState("");
  const [opcionesValidas, setOpcionesValidas] = useState<DesplegableModel[]>([]);

  const onHandleChange = (value: number, textLabel: string) => {
    handleChange(value, id);
    setTexto(textLabel);
    setOpen(false);
  };

  const FiltrarOpciones = (ev: any) => {
    const texto = ev.target.value;
    let opciones: DesplegableModel[] = array.filter((item: DesplegableModel) =>
      item.text.toLowerCase().includes(texto.toLowerCase())
    );
    setOpcionesValidas(opciones);
    setSearchText(texto);
  };

  useEffect(() => {
    if (open) {
      setOpcionesValidas(array);
    }
    if (texto === "" || (value === -1 && !mostrarTodos)) {
      // setTexto("Seleccione una opcion");
    }
  }, [open]);

  return (
    <>
      <IonButton onClick={() => setOpen(true)} slot="end" fill="clear">
        <IonIcon aria-hidden="true" ios={searchOutline} md={search} size="large" />
      </IonButton>
      <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButton slot="end" fill="clear" expand="full" onClick={() => setOpen(false)}>
              Cancelar
            </IonButton>
            <IonTitle>{id}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {mostrarSearch && (
            <IonSearchbar
              value={searchText}
              onIonInput={(ev) => FiltrarOpciones(ev)}
              debounce={500}
              placeholder="Buscar por nombre"
            />
          )}
          <IonList>
            {mostrarTodos && (
              <IonItem key={-1} button onClick={() => onHandleChange(-1, "Mostrar todos")}>
                <IonLabel>Mostrar todos</IonLabel>
                <IonIcon
                  slot="start"
                  icon={-1 !== value ? radioButtonOffOutline : radioButtonOnOutline}
                  size="large"
                />
              </IonItem>
            )}
            {opcionesValidas?.map((item: DesplegableModel) => (
              <IonItem
                key={item.codigo}
                button
                onClick={() => onHandleChange(item.codigo, item.text)}
              >
                <IonLabel>
                  <h2>{item.text}</h2>
                  {item.nota && <small>{item.nota}</small>}
                </IonLabel>
                <IonIcon
                  slot="start"
                  icon={item.codigo !== value ? radioButtonOffOutline : radioButtonOnOutline}
                  size="large"
                />
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default CustomDesplegable;
