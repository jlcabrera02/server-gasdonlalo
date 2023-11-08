import React from "react";
import path from "path";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import format from "../assets/formatTiempo";
import Decimal from "decimal.js-light";
import { config } from "dotenv";
config();
// const calibriN = require("../assets/fonts/calibrib.ttf");

const PDFPreliquidacion = ({ data, otherData }) => {
  const gdl = `http://localhost:${process.env.PORT}/static/assets/img/GDL.png`;
  const pemex = `http://localhost:${process.env.PORT}/static/assets/img/pemex.png`;
  const { empleado, estacionServicio, vales, efectivo, turno } = otherData;
  Font.register({
    family: "calibriN",
    src: path.join(__dirname, "../assets/fonts/calibrib.ttf"),
  });
  const date = new Date(Date.now());

  const styles = StyleSheet.create({
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titulos: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    page: {
      // flexDirection: "row",
      fontSize: "10pt",
      backgroundColor: "#fff",
      padding: "35px",
      width: "100%",
    },
    theaderRow: {
      fontFamily: "calibriN",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      backgroundColor: "#e2e2e2",
      width: "100%",
      border: 1,
      borderColor: "#000",
    },
    tbodyL: {
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      width: "100%",
      borderRight: 1,
      borderBottom: 1,
      borderColor: "#000",
    },
    title: {
      fontFamily: "calibriN",
      fontSize: "15pt",
      textAlign: "center",
    },
    textEnd: {
      fontFamily: "calibriN",
      fontSize: "12pt",
      textAlign: "right",
    },
    theader: {
      borderRight: 1,
      borderColor: "#000",
      width: "100%",
      height: "100%",
      margin: "0px",
      textAlign: "center",
    },
    theaderInit: {
      width: "100%",
      height: "100%",
      borderLeft: 1,
      borderRight: 1,
      margin: "0px",
      textAlign: "center",
    },
    theaderLast: {
      width: "100%",
      height: "100%",
      margin: "0px",
      textAlign: "center",
    },
    divLect: {
      width: "90%",
    },
    infoBox: {
      width: "100%",
      border: 1,
      borderRadius: "2px",
      backgroundColor: "#e2e2e2",
      textAlign: "center",
    },
    erroresBox: {
      border: "1px solid black",
      width: "200px",
      height: "200px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const HeaderInf = ({ empleado, estacionServicio }) => {
    return (
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "200px", textAlign: "center" }}>
          <Text>Despachador</Text>
          <View
            style={{
              border: 1,
              textAlign: "center",
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>
              {empleado
                ? `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
                : ""}
            </Text>
          </View>
        </View>

        <View style={{ width: "100px", textAlign: "center" }}>
          <Text>Estación Servicio</Text>
          <View>
            <View
              style={{
                border: 1,
                textAlign: "center",
                borderColor: "#000",
                borderRadius: "2px",
                backgroundColor: "#e2e2e2",
              }}
            >
              <Text>{estacionServicio.nombre}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100px", textAlign: "center" }}>
          <Text>Fecha</Text>
          <View>
            <View
              style={{
                border: 1,
                textAlign: "center",
                borderColor: "#000",
                borderRadius: "2px",
                backgroundColor: "#e2e2e2",
              }}
            >
              <Text>{format.tiempoLocalShort(date, true)}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100px", textAlign: "center" }}>
          <Text>Turno</Text>
          <View>
            <View
              style={{
                border: 1,
                textAlign: "center",
                borderColor: "#000",
                borderRadius: "2px",
                backgroundColor: "#e2e2e2",
              }}
            >
              <Text>{turno.turno || ""}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const TheaderL = () => {
    return (
      <View style={styles.theaderRow}>
        <Text style={styles.theader}>Manguera</Text>
        <Text style={styles.theader}>Lectura Inicial</Text>
        <Text style={styles.theader}>Lectura Final</Text>
        <Text style={styles.theader}>Litros Vendidos</Text>
        <Text style={styles.theader}>Precio unitario</Text>
        <Text style={styles.theaderLast}>Importe</Text>
      </View>
    );
  };

  const TbodyL = ({ data }) => {
    return (
      <View
        style={[
          styles.tbodyL,
          Number(data.lecturaFinal) < Number(data.lecturaInicial)
            ? { backgroundColor: "#ff8585" }
            : null,
        ]}
      >
        <Text style={styles.theaderInit}>{data.idManguera}</Text>
        <Text style={styles.theader}>
          {format.zFill(Number(data.lecturaInicial))}
        </Text>
        <Text style={styles.theader}>{data.lecturaFinal}</Text>
        <Text style={styles.theader}>{data.litrosVendidos}</Text>
        <Text style={styles.theader}>
          {format.formatDinero(data.precioUnitario)}
        </Text>
        <Text style={styles.theaderLast}>
          {format.formatDinero(
            new Decimal(Number(data.litrosVendidos))
              .mul(Number(data.precioUnitario))
              .toFixed(2)
          )}
        </Text>
      </View>
    );
  };

  const TheaderEV = () => {
    return (
      <View style={styles.theaderRow}>
        <Text style={styles.theaderLast}>Monto</Text>
      </View>
    );
  };

  const TbodyE = ({ cantidad }) => {
    return (
      <View style={styles.tbodyL}>
        <Text style={styles.theaderInit}>
          {format.formatDinero(Number(cantidad))}
        </Text>
      </View>
    );
  };

  const getError = () => {
    if (data.error) {
      const filtered = data.mangueras.filter(
        (el) => Number(el.lecturaFinal) < Number(el.lecturaInicial)
      );
      return `Revisar magueras: ${filtered.map((el) => `${el.idManguera}`)}`;
    } else {
      return "Ningun problema detectado";
    }
  };

  return (
    <Document title="Reporte de liquidación">
      <Page size="LETTER" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Image src={gdl} style={{ width: "55px" }} />

          <View style={styles.titulos}>
            <Text style={{ fontFamily: "calibriN" }}>
              GASOLINERIA DON LALO S.A. DE C.V.
            </Text>
            <Text>{`Reporte de preliquidación`}</Text>
          </View>

          <Image src={pemex} style={{ width: "80px" }}></Image>
        </View>
        {/*  <View style={styles.textEnd}>
          <Text>
            Empleado:{" "}
            {empleado.length > 0
              ? `${empleado[0].nombre} ${empleado[0].apellido_paterno} ${empleado[0].apellido_materno}`
              : ""}
          </Text>
        </View> */}
        <View style={{ margin: "2px" }}>
          <HeaderInf empleado={empleado} estacionServicio={estacionServicio} />
        </View>

        <View
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "70%",
            flexWrap: "wrap",
          }}
        >
          <View style={styles.divLect}>
            <Text>Lecturas de bombas</Text>
            <TheaderL />
            {format
              .orderMangueras(data.mangueras, { property: "idManguera" })
              .array.map((el, i) => (
                <TbodyL key={i} data={el} />
              ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              width: "90%",
              marginTop: "3px",
            }}
          >
            <View style={{ width: "40%" }}>
              <Text>Efectivo</Text>
              <TheaderEV />
              {efectivo.map((el, i) => (
                <TbodyE cantidad={el} key={i} />
              ))}
            </View>
            <View style={{ width: "40%", marginTop: "3px" }}>
              <Text>Vales</Text>
              <TheaderEV />

              {vales.map((el, i) => (
                <TbodyE cantidad={el} key={i} />
              ))}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "3px",
            }}
          >
            <Text>Total de documentos</Text>
            <View
              style={{
                width: "40%",
                marginTop: "3px",
                border: "1px solid black",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                    borderRight: "1px solid black",
                    backgroundColor: "#e2e2e2",
                    fontFamily: "calibriN",
                  }}
                >
                  <Text>Documento</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                    backgroundColor: "#e2e2e2",
                    fontFamily: "calibriN",
                  }}
                >
                  <Text>Cantidad</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "1px solid black",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>Vales</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                  }}
                >
                  <Text>{vales.length}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "1px solid black",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>Efectivo</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                  }}
                >
                  <Text>{efectivo.length}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "1px solid black",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                    borderRight: "1px solid black",
                    fontFamily: "calibriN",
                  }}
                >
                  <Text>Total</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "50%",
                  }}
                >
                  <Text>{vales.length + efectivo.length}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Resumen de totales */}
        <View
          style={{
            textAlign: "center",
            width: "25%",
            position: "absolute",
            right: "35px",
            top: "27%",
          }}
        >
          <View>
            <Text style={{ fontFamily: "calibriN" }}>Total Ventas</Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>{format.formatDinero(Number(data.totalEntregar))}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: "calibriN", marginTop: "5px" }}>
              Total entregado
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>{format.formatDinero(Number(data.totalEntregado))}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: "calibriN", marginTop: "5px" }}>
              Diferencia{" "}
              {Number(data.diferencia) === 0
                ? null
                : Number(data.diferencia) < 0
                ? "sobrante: "
                : "faltante: "}
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>{format.formatDinero(data.diferencia)}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: "calibriN", marginTop: "5px" }}>
              Total efectivo
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>{format.formatDinero(data.totalEfectivo)}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: "calibriN", marginTop: "5px" }}>
              Total vales
            </Text>
          </View>
          <View
            style={{
              border: 1,
              borderColor: "#000",
              borderRadius: "2px",
              backgroundColor: "#e2e2e2",
            }}
          >
            <Text>{format.formatDinero(data.totalVales)}</Text>
          </View>
        </View>
        {/* Reinicios */}
        <View
          style={{
            display: "flex",
            flex: "row",
            alignItems: "center",
            position: "absolute",
            bottom: "35px",
            right: "35px",
          }}
        >
          <Text style={{ fontFamily: "calibriN" }}>
            Posibles reinicios/errores
          </Text>
          <View style={styles.erroresBox}>
            <Text style={{ textAlign: "justify" }}>{getError()}</Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: "15px",
            right: "35px",
          }}
        >
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}.`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  );
};

const createPDF = async (data) => {
  return await ReactPDF.renderToStream(<PDFPreliquidacion {...data} />);
};

export default createPDF;
