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
import { useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { Usuario } from "../interfaces";
import "./Page.css";

interface ContainerProps {
  usuarioLogueado: Usuario;
}
const Page: React.FC<ContainerProps> = ({ usuarioLogueado }) => {
  const { name } = useParams<{ name: string }>();

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
        {usuarioLogueado && <ExploreContainer name={name} usuarioLogueado={usuarioLogueado!} />}
      </IonContent>
    </IonPage>
  );
};

export default Page;
