import React, { useState } from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonPage,
  IonContent,
  IonList,
  IonItem,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import {
  call,
  homeOutline,
  library,
  person,
  playCircle,
  radio,
  search,
  settings,
  starOutline,
} from "ionicons/icons";
import { IonReactRouter } from "@ionic/react-router";

type Tab = {
  id: number;
  label: string;
  content: JSX.Element;
};

const TabsEstudios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    {
      id: 0,
      label: "Tab 1",
      content: (
        <IonContent>
          <IonList>
            <IonItem>Item 1</IonItem>
            <IonItem>Item 2</IonItem>
            <IonItem>Item 3</IonItem>
          </IonList>
        </IonContent>
      ),
    },
    {
      id: 1,
      label: "Tab 2",
      content: (
        <IonContent>
          <IonList>
            <IonItem>Item A</IonItem>
            <IonItem>Item B</IonItem>
            <IonItem>Item C</IonItem>
          </IonList>
        </IonContent>
      ),
    },
  ];

  return (
    <IonReactRouter>
      <IonTabs>
        <IonTabBar>
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={playCircle} />
            <IonLabel>Listen now</IonLabel>
          </IonTabButton>

          <IonTabButton tab="radio" href="/radio">
            <IonIcon icon={radio} />
            <IonLabel>Radio</IonLabel>
          </IonTabButton>

          <IonTabButton tab="library" href="/library">
            <IonIcon icon={library} />
            <IonLabel>Library</IonLabel>
          </IonTabButton>

          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
        </IonTabBar>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
          <Route path="/home" render={() => <small>home</small>} exact={true} />
          <Route path="/radio" render={() => <small>radio</small>} exact={true} />
          <Route path="/library" render={() => <small>library</small>} exact={true} />
          <Route path="/search" render={() => <small>search</small>} exact={true} />
        </IonRouterOutlet>
      </IonTabs>
    </IonReactRouter>
  );
};

export default TabsEstudios;
