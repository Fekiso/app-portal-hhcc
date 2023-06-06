import { IonAlert, IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import "./DialogoConfirmacion.css";

interface ContainerProps {
  titulo: string;
  contenido: string;
  abrirCerrarModal: boolean;
  colorBotonNo: string;
  colorBotonSi: string;
  textoBotonNo: string;
  textoBotonSi: string;
  handleclickBotonNo: () => void;
  handleclickBotonSi: () => void;
}

const DialogoConfirmacion: React.FC<ContainerProps> = ({
  titulo,
  contenido,
  abrirCerrarModal,
  colorBotonNo,
  colorBotonSi,
  textoBotonNo,
  textoBotonSi,
  handleclickBotonNo,
  handleclickBotonSi,
}) => {
  const [botonSi, setBotonSi] = useState({
    texto: "",
    clase: "",
  });
  const [botonNo, setBotonNo] = useState({
    texto: "",
    clase: "",
  });

  const getColor = (color: string) => {
    switch (color) {
      case "verde":
        return "success";
      case "rojo":
        return "danger";
      case "amarillo":
        return "warning";
      default:
        return "primary";
    }
  };

  const CargarBotones = () => {
    setBotonSi({
      texto: textoBotonSi,
      clase: getColor(colorBotonSi),
    });
    setBotonNo({
      texto: textoBotonNo,
      clase: getColor(colorBotonNo),
    });
  };

  useEffect(() => {
    CargarBotones();
  }, []);

  return (
    <IonAlert
      header={titulo}
      message={contenido}
      isOpen={abrirCerrarModal}
      className="custom-alert"
      buttons={[
        {
          text: botonNo.texto,
          role: "cancel",
          handler: handleclickBotonNo,
          cssClass: botonNo.clase,
        },
        {
          text: botonSi.texto,
          role: "accept",
          handler: handleclickBotonSi,
          cssClass: botonSi.clase,
        },
      ]}
    />
  );
};

export default DialogoConfirmacion;
