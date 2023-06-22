import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { Usuario } from "../interfaces";
import "./Page.css";
import { useEffect, useState } from "react";
import useUsuario from "../hooks/usuarios";

interface ContainerProps {
  usuarioLogueado: Usuario;
  setUsuarioLogueado: (usuario: Usuario) => void;
}
const Page: React.FC<ContainerProps> = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const { name } = useParams<{ name: string }>();
  const [usuario, setUsuario] = useState<Usuario>();
  const { recuperarSesion } = useUsuario();
  const history = useHistory();

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

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonCard>
          <IonItem lines="none">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{name}</IonTitle>
          </IonItem>
        </IonCard>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonCard>
            <IonTitle size="large">{name}</IonTitle>
          </IonCard>
        </IonHeader>
        {usuario && <ExploreContainer usuarioLogueado={usuario!} />}
      </IonContent>
    </IonPage>
  );
};

export default Page;
