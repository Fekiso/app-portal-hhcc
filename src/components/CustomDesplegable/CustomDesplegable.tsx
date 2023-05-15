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
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { radioButtonOffOutline, radioButtonOnOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DesplegableModel } from "../../interfaces";
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
  const [isOpen, setIsOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState(false);
  const [opcionesValidas, setOpcionesValidas] = useState<DesplegableModel[]>(
    []
  );

  const onHandleChange = (value: number, textLabel: string) => {
    handleChange(value, id);
    setTexto(textLabel);
    setIsOpen(false);
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
    if (isOpen) {
      setOpcionesValidas(array);
    }
    if (texto === "" || (value === -1 && !mostrarTodos)) {
      // setTexto("Seleccione una opcion");
    }
  }, [isOpen]);

  return (
    <>
      <IonLabel position={"floating"}>{id}: </IonLabel>
      <IonInput onFocus={() => setIsOpen(true)} value={texto} />

      <IonModal isOpen={isOpen} onWillDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButton
              slot="end"
              fill="clear"
              expand="full"
              onClick={() => setIsOpen(false)}
            >
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
              <IonItem
                key={-1}
                button
                onClick={() => onHandleChange(-1, "Mostrar todos")}
              >
                <IonLabel>Mostrar todos</IonLabel>
                <IonIcon
                  slot="start"
                  icon={
                    -1 !== value ? radioButtonOffOutline : radioButtonOnOutline
                  }
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
                  {item.nota && <p>{item.nota}</p>}
                </IonLabel>
                <IonIcon
                  slot="start"
                  icon={
                    item.codigo !== value
                      ? radioButtonOffOutline
                      : radioButtonOnOutline
                  }
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
