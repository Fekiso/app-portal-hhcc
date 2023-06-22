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

import { useHistory, useLocation, useParams } from "react-router-dom";
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
import useUsuario from "../hooks/usuarios";

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
    title: "Registrar Nuevo Paciente",
    url: "/portal/Registrar Nuevo Paciente",
    iosIcon: personAddOutline,
    mdIcon: personAdd,
  },
  {
    title: "Paciente",
    url: "/portal/Paciente",
    iosIcon: searchOutline,
    mdIcon: search,
  },
  {
    title: "Nuevo Turno",
    url: "/portal/Nuevo Turno",
    iosIcon: medkitOutline,
    mdIcon: medkit,
  },
];

const labels = [
  {
    title: "Agenda",
    url: "/portal/Agenda",
    iosIcon: todayOutline,
    mdIcon: today,
  },
  {
    title: "Limpiar ficha",
    url: "/portal/Buscar",
    iosIcon: searchOutline,
    mdIcon: search,
  },
  {
    title: "Dar Turno",
    url: "/portal/Paciente/:codPaciente/Dar Turno",
    iosIcon: medkitOutline,
    mdIcon: medkit,
  },
  {
    title: "Historial de Turnos",
    url: "/portal/Paciente/:codPaciente/TurnosPaciente",
    iosIcon: personAddOutline,
    mdIcon: personAdd,
  },
  {
    title: "Pdf's Paciente",
    url: "/portal/Paciente/:codPaciente/PdfPaciente",
    iosIcon: personAddOutline,
    mdIcon: personAdd,
  },
  {
    title: "Nuevo Pedido",
    url: "/portal/Paciente/:codPaciente/PedidoPaciente",
    iosIcon: personAddOutline,
    mdIcon: personAdd,
  },
];

const Menu: React.FC<ContainerProps> = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const { name } = useParams<{ name: string }>();
  const [usuario, setUsuario] = useState<Usuario>({
    usuario: "",
    password: "",
    token: "",
    codigo: 0,
    especialidadNom: "",
    nombreCompleto: "",
    nombreUsuario: "",
    prestadorCod: 0,
    prestadorNom: "",
    prestadores: [],
    rol: "",
  });
  const location = useLocation();
  const history = useHistory();
  const { recuperarSesion } = useUsuario();

  useEffect(() => {
    if (usuarioLogueado) {
      setUsuario(usuarioLogueado);
    } else {
      if (recuperarSesion().codigo !== 0) {
        setUsuario(recuperarSesion());
        setUsuarioLogueado(recuperarSesion());
      } else history.push("/ErrorPage");
    }
  }, []);

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
  // pdf gpalau patricia aRJONA
  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{usuario?.nombreCompleto}</IonListHeader>
          <IonNote>{usuario?.especialidadNom}</IonNote>
          {/* //@ts-ignore */}
          {/* { name === "Paciente" ? labels.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === appPage.url ? "selected" : ""}
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
          }):*/}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === appPage.url ? "selected" : ""}
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
            <IonIcon aria-hidden="true" slot="end" ios={logOutOutline} md={logOut} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
