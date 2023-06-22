import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import LoginIonic from "./pages/Login/Login";
import { createHashHistory } from "history";
import { useState } from "react";
import { Paciente, Usuario } from "./interfaces";
import { Notificacion } from "./interfaces";
import CustomToast from "./components/CustomToast/CustomToast";
import BuscadorPacientes from "./components/BuscadorPacientes/BuscadorPacientes";
import PageError from "./pages/PageError/PageError";
import FichaPaciente from "./components/FichaPaciente/FichaPaciente";

setupIonicReact();

const App: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [paciente, setPaciente] = useState<Paciente>();
  return (
    <IonApp>
      {/* <IonReactRouter>
        <Switch>
          <Route path="/" exact={true}>
            <Redirect to="/Login" />
          </Route>
          <Route path="/Login" exact={true}>
            <LoginIonic setUsuarioLogueado={setUsuario} />
          </Route>
          <Route path="/portal/" exact={true}>
            <Redirect to="/portal/Agenda" />
          </Route>
          <Route path="/portal/:name" exact={true}>
            <IonSplitPane contentId="main">
              <Menu usuarioLogueado={usuario!} setUsuarioLogueado={setUsuario} />
              <IonRouterOutlet id="main">
                <Page usuarioLogueado={usuario!} setUsuarioLogueado={setUsuario} />
              </IonRouterOutlet>
            </IonSplitPane>
          </Route>
          <Route path="/*">
            <PageError />
          </Route>
        </Switch>
      </IonReactRouter> */}
      <FichaPaciente setPacienteProp={setPaciente} />
    </IonApp>
  );
};

export default App;
