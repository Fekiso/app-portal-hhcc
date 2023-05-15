import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useHistory, useLocation } from "react-router-dom";
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  logOut,
  logOutOutline,
  mailOutline,
  mailSharp,
  medkit,
  medkitOutline,
  paperPlaneOutline,
  paperPlaneSharp,
  personAdd,
  personAddOutline,
  search,
  searchOutline,
  today,
  todayOutline,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
} from "ionicons/icons";
import "./Menu.css";
import { useEffect, useState } from "react";
import { Usuario } from "../interfaces";

interface ContainerProps {
  usuarioLogueado: Usuario;
  setUsuarioLogueado: (prestador: Usuario) => void;
}

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Agenda",
    url: "/portal/Agenda",
    iosIcon: todayOutline,
    mdIcon: today,
  },
  {
    title: "Registrar Paciente",
    url: "/portal/Registrar",
    iosIcon: personAddOutline,
    mdIcon: personAdd,
  },
  {
    title: "Buscar Paciente",
    url: "/portal/Buscar",
    iosIcon: searchOutline,
    mdIcon: search,
  },
  {
    title: "Dar Turno",
    url: "/portal/DarTurno",
    iosIcon: medkitOutline,
    mdIcon: medkit,
  },
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

const Menu: React.FC<ContainerProps> = ({
  usuarioLogueado,
  setUsuarioLogueado,
}) => {
  const location = useLocation();
  const history = useHistory();

  const redirigirLogin = (): void => {
    setUsuarioLogueado({
      usuario: "",
      password: "",
      token: "",
      codigo: 0,
      especialidadNom: "",
      nombreCompleto: "",
      nombreUsuario: "",
      prestadorCod: 0,
      prestadorNom: "",
      rol: "",
      prestadores: [],
    });
    history.push("/");
  };
  
  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{usuarioLogueado?.nombreCompleto}</IonListHeader>
          <IonNote>{usuarioLogueado?.especialidadNom}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList>
          <IonItem button onClick={redirigirLogin} fill="solid" lines="none">
            <IonLabel color="danger">Cerrar Sesion</IonLabel>
            <IonIcon
              aria-hidden="true"
              slot="end"
              ios={logOutOutline}
              md={logOut}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
