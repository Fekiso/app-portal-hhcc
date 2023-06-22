import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonTitle,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import StyledButton from "../StyledButton/StyledButton";
import useNotificacion from "../../hooks/notificacion";
import axios from "axios";
import { Usuario } from "../../interfaces";
import { Paciente } from "../../interfaces";
import CustomToast from "../CustomToast/CustomToast";

interface ContainerProps {
  usuarioLogueado: Usuario;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setPaciente: (paciente: Paciente) => void;
}

const BuscadorPacientes: React.FC<ContainerProps> = ({
  usuarioLogueado,
  isOpen,
  setIsOpen,
  setPaciente,
}) => {
  return <p>a</p>;
};

export default BuscadorPacientes;
