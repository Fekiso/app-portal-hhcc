import React, { useEffect, useState } from "react";
import "./PageError.css";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { alert, alertOutline } from "ionicons/icons";
import useUsuario from "../../hooks/usuarios";
import { Usuario } from "../../interfaces";

interface ContainerProps {
  motivo?: string;
}
const PageError: React.FC<ContainerProps> = ({ motivo }) => {
  // let { motivo } = props;
  const location = useLocation();
  const [motivoError, setMotivoError] = useState<string>("");
  const [usuario, setUsuario] = useState<Usuario>();
  const [cargando, setCargando] = useState(false);
  const history = useHistory();
  const { recuperarSesion } = useUsuario();

  useEffect(() => {
    try {
      //@ts-ignore
      setMotivoError(location.state?.motivo || "");
      if (recuperarSesion().codigo !== 0) {
        setMotivoError("404");
      } else setMotivoError("sesion perdida");
    } catch (e) {
      //@ts-ignore
      console.log("Error: " + e.message);
    }
    document.title = "Ha ocurrido un error: " + motivo;
  }, []);

  const handleClickRedirigir = (destino: string) => {
    switch (destino) {
      case "MainPage":
        history.push("/page/Inicio");
        break;
      case "CerrarSesion":
        history.push("/");
        break;
      default:
        break;
    }
  };

  return (
    <IonGrid>
      <IonRow className="LoginViewRow justify-content-center">
        <IonCol>
          <IonCard>
            <IonCardHeader>
              <IonRow className="justify-content-center">
                <IonCardTitle>
                  <h1>Se ha producido un error</h1>
                </IonCardTitle>
              </IonRow>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonIcon slot="start" size="large" color="danger" ios={alertOutline} md={alert} />
                <IonText color="danger">
                  {motivo === "sesion perdida" ? (
                    <>
                      <h2>
                        {"Tu sesión ha expirado "}
                        <a href="/">presiona aquí para redireccionarte al inicio de sesión</a>
                      </h2>
                    </>
                  ) : (
                    <h2>
                      No estas logueado
                      <a href="/">presiona aquí para redireccionarte al inicio</a>
                    </h2>
                  )}
                </IonText>
                <IonIcon slot="end" size="large" color="danger" ios={alertOutline} md={alert} />
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PageError;
