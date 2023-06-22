import React, { useEffect, useState } from "react";
import { Paciente, Usuario } from "../../interfaces";
import {
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import RtfEditor from "../RtfEditor/RtfEditor";
import StyledButton from "../StyledButton/StyledButton";
import dayjs from "dayjs";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";
import axios, { AxiosResponse } from "axios";

interface ContainerProps {
  usuarioLogueado: Usuario;
  paciente: Paciente;
  abrirModal: boolean;
  setAbrirModal: (abrir: boolean) => void;
}
const ModalPedido: React.FC<ContainerProps> = ({
  usuarioLogueado,
  paciente,
  abrirModal,
  setAbrirModal,
}) => {
  const [pedido, setPedido] = useState<string>("");
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();

  useEffect(() => {
    setPedido(`<p>Fecha: ${dayjs().format("DD/MM/YYYY")}</p><p><br><br>
                  Paciente: ${paciente?.apellido}, ${paciente?.nombre}<br>
                  Edad: ${dayjs().diff(paciente?.nacimiento, "year")}<br>
                  Mutual: ${paciente?.mutualNombre}<br>
                  Nro. Afiliado: ${paciente?.mutualAfiliado}<br>
                  Diagnostico: <br><br><br></p>`);
  }, [paciente]);

  const handleChangeInput = (value: any, id: string) => {
    switch (id) {
      case "pedido":
        setPedido(value);
        break;
      default:
        mostrarNotificacion(true, "Cambio inválida", "rojo");
        break;
    }
  };

  const handleClickEnviar = async () => {
    let estado = 0;
    let control = true;
    let url;
    let respuesta = "";
    let errorAxios = "";
    let blnErrorAxios = false;

    try {
      let config = {
        headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
      };
      const response: AxiosResponse = await axios.post(
        getUrlAxio(),
        {
          pedidoHTML: pedido,
          prestador: usuarioLogueado.prestadorCod,
          pacienteDoc: paciente.documentoNro,
          mail: paciente.email,
        },
        config
      );

      estado = response.status;
      respuesta = response.statusText;

      if (estado === 200 && respuesta === "OK") {
        mostrarNotificacion(true, "Pedido enviado correctamente", "Verde");
        setAbrirModal(false);
      } else {
        mostrarNotificacion(true, "Ocurrio un error al enviar el pedido", "rojo");
      }
    } catch (error) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + error.response.data, "rojo");
      blnErrorAxios = true;
    }
  };

  return (
    <IonModal isOpen={abrirModal} onDidDismiss={() => setAbrirModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pedido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" id="inbox-list">
        <IonList>
          <IonItem>
            <IonInput label="Email" label-placement="floating" value={paciente?.email} readonly />
          </IonItem>
          <IonRow>
            <IonCol>
              <RtfEditor
                id="pedido"
                handleChange={handleChangeInput}
                defaultValue={pedido}
                readOnly={false}
              />
            </IonCol>
          </IonRow>
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonRow className="ion-justify-content-around">
            <StyledButton
              lines="none"
              expand="block"
              className="rojo  ion-padding-horizontal"
              onClick={setAbrirModal(false)}
            >
              Cancelar Pedido
            </StyledButton>
            <StyledButton
              lines="none"
              expand="block"
              className="verde  ion-padding-horizontal"
              onClick={handleClickEnviar}
            >
              Enviar Pedido
            </StyledButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ModalPedido;
