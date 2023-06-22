import React, { useEffect, useState } from "react";
import { DesplegableModel, Diagnostico, Evolucion, Paciente, Usuario } from "../../interfaces";
import RtfEditor from "../RtfEditor/RtfEditor";
import dayjs from "dayjs";
import { IonCard, IonCol, IonGrid, IonInput, IonItem, IonRow } from "@ionic/react";
import StyledButton from "../StyledButton/StyledButton";
import CustomDesplegable from "../CustomDesplegable/CustomDesplegable";
import useNotificacion from "../../hooks/notificacion";
import useUrlAxio from "../../hooks/urlAxio";
import axios, { AxiosResponse } from "axios";

interface ContainerProps {
  evolucionSel?: Evolucion;
  visualizar?: boolean;
  usuarioLogueado: Usuario;
  paciente: Paciente;
  setVisible: (visible: boolean) => void;
}
const EvolucionViewer: React.FC<ContainerProps> = ({
  evolucionSel,
  visualizar,
  usuarioLogueado,
  paciente,
  setVisible,
}) => {
  const [diagnosticosSelect, setDiagnosticosSelect] = useState<DesplegableModel[]>([]);
  const [evolucion, setEvolucion] = useState<Evolucion>(
    evolucionSel || {
      codigo: 0,
      fecha: dayjs().format("DD/MM/YYYY"),
      prestadorCod: usuarioLogueado.prestadorCod,
      prestadorNom: usuarioLogueado.prestadorNom,
      pacienteCod: paciente.codigo,
      motivoConsulta: "",
      motivo: "",
      diagnosticoCod: 0,
      diagnosticoNom: "",
      derivanteMat: "",
      derivanteNom: "",
    }
  );
  const { mostrar, mensaje, color, mostrarNotificacion } = useNotificacion();
  const { getUrlAxio } = useUrlAxio();

  const TraerDiagnosticos = async () => {
    const config = {
      headers: { Authorization: `Bearer ${usuarioLogueado.token}` },
    };

    try {
      const response: AxiosResponse = await axios.get(`${getUrlAxio()}Diagnosticos`, config);

      let listado: DesplegableModel[] = [];
      for (let i = 0; i < response.data.length; i++) {
        listado.push({
          codigo: response.data[i].codigo,
          text: response.data[i].nombre,
        });
      }
      setDiagnosticosSelect(listado);
    } catch (error) {
      //@ts-ignore
      mostrarNotificacion(true, "Error: " + error.response, "rojo");
      return [];
    }
  };

  useEffect(() => {
    TraerDiagnosticos();
  }, []);
  useEffect(() => {
    setEvolucion(
      evolucionSel || {
        codigo: 0,
        fecha: dayjs().format("DD/MM/YYYY"),
        prestadorCod: usuarioLogueado.prestadorCod,
        prestadorNom: usuarioLogueado.prestadorNom,
        pacienteCod: paciente.codigo,
        motivoConsulta: "",
        motivo: "",
        diagnosticoCod: 0,
        diagnosticoNom: "",
        derivanteMat: "",
        derivanteNom: "",
      }
    );
  }, [evolucionSel]);

  const handleChangeInput = (value: any, id: string) => {
    let evolucionModificada = { ...evolucion };

    switch (id) {
      case "diagnostico":
        diagnosticosSelect.forEach((diagnostico) => {
          if (diagnostico.codigo === value) {
            evolucionModificada.diagnosticoCod = diagnostico.codigo;
            evolucionModificada.diagnosticoNom = diagnostico.text;
          }
        });
        break;
      case "motivo":
        evolucionModificada.motivoConsulta = value;
        break;
      case "evolucion":
        evolucionModificada.motivo = value;
        break;
      default:
        mostrarNotificacion(true, "Cambio inválida", "rojo");
        break;
    }
    setEvolucion(evolucionModificada);
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" size-md="6">
          <IonItem>
            <IonInput
              label="Motivo"
              label-placement="floating"
              id="motivo"
              value={evolucion.motivoConsulta}
              // @ts-ignore
              onKeyUp={(e) => handleChangeInput(e.target.value, "motivo")}
              // className={`${erroresPaciente.mutualAfiliado && "ion-invalid"}`}
            />
            {/* {erroresPaciente.mutualAfiliado && (
              <>
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  ios={alertOutline}
                  md={alert}
                  id="btnErrorMutualAfiliado"
                  size="small"
                  color="danger"
                />
                <IonPopover trigger="btnErrorMutualAfiliado" triggerAction="click">
                  <IonContent class="ion-padding">
                    No se ingreso un numero de afiliado, en caso de no tener
                  </IonContent>
                </IonPopover>
              </>
            )} */}
          </IonItem>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonItem>
            <IonInput
              readonly
              label="Diagnostico"
              label-placement="floating"
              id="mutualNombre"
              value={evolucion.diagnosticoNom}
              // className={`${erroresPaciente.mutualNombre && "ion-invalid"}`}
            />
            <CustomDesplegable
              array={diagnosticosSelect}
              value={evolucion.diagnosticoCod}
              handleChange={handleChangeInput}
              mostrarTodos={false}
              mostrarSearch={true}
              id="diagnostico"
            />
            {/* {erroresPaciente.mutual && (
            <>
              <IonIcon
                aria-hidden="true"
                slot="end"
                ios={alertOutline}
                md={alert}
                id="btnErrorMutual"
                size="small"
                color="danger"
              />
              <IonPopover trigger="btnErrorMutual" triggerAction="click">
                <IonContent class="ion-padding">No se selecciono una mutual</IonContent>
              </IonPopover>
            </>
          )} */}
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <RtfEditor
            id="evolucion"
            handleChange={handleChangeInput}
            defaultValue={evolucion.motivo}
            readOnly={dayjs(evolucion.fecha).format("DD/MM/YYYY") !== dayjs().format("DD/MM/YYYY")}
          />
        </IonCol>
      </IonRow>
      {evolucionSel ? (
        <IonRow className="ion-align-items-center">
          <IonCol sizeXs="6" sizeMd="3">
            <StyledButton expand="block" onClick={() => setVisible(false)}>
              Ocultar
            </StyledButton>
          </IonCol>
          {dayjs(evolucionSel.fecha).isSame(dayjs()) && (
            <IonCol sizeXs="6" sizeMd="3">
              <StyledButton expand="block" onClick={() => console.log(evolucion)}>
                Grabar Cambios
              </StyledButton>
            </IonCol>
          )}
        </IonRow>
      ) : (
        <>
          <IonRow className="ion-align-items-center">
            <IonCol sizeXs="6" sizeMd="3">
              <StyledButton expand="block" onClick={() => setVisible(false)}>
                Ocultar
              </StyledButton>
            </IonCol>
            <IonCol sizeXs="6" sizeMd="3">
              <StyledButton expand="block" onClick={() => console.log(evolucion)}>
                Guardar Evolucion
              </StyledButton>
            </IonCol>
          </IonRow>
        </>
      )}
    </IonGrid>
  );
};
export default EvolucionViewer;
