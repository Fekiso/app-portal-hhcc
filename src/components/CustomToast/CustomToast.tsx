import { IonToast } from "@ionic/react";
import {
  alertOutline,
  checkmarkOutline,
  closeOutline,
  informationOutline,
  warningOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Notificacion } from "../../interfaces";
import "./CustomToast.css";

const CustomToast: React.FC<Notificacion> = ({ mostrar, mensaje, color }) => {
  const getColor = (): string => {
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

  const getIcon = (): any => {
    switch (color) {
      case "verde":
        return checkmarkOutline;
      case "rojo":
        return alertOutline;
      case "amarillo":
        return warningOutline;
      default:
        return informationOutline;
    }
  };

  return (
    <IonToast
      isOpen={mostrar}
      message={mensaje}
      duration={5000}
      position="top"
      className={getColor()}
      icon={getIcon()}
      buttons={[
        {
          icon: getIcon(),
          role: "cancel",
        },
      ]}
    />
  );
};

export default CustomToast;
