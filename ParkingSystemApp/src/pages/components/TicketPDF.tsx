//import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

Font.register({
  family: "JetBrainsMono",
  fonts: [
    { src: "/fonts/JetBrainsMono-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/JetBrainsMono-Bold.ttf", fontWeight: "bold" },
  ],
});


// Define los estilos con un tamaño fijo de 58 mm de ancho
const styles = StyleSheet.create({
  page: {
    width: "58mm", // Ancho de 58 mm (configuración precisa)
    padding: "6mm",
    fontSize: 10,
    fontFamily: "JetBrainsMono"
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold"
  },
  table: {
    width: "100%",
    marginVertical: 5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2
  },
  image: {
    width: "40mm", // Ajusta el tamaño de la imagen
    height: "40mm",
    marginLeft: "auto",
    marginRight: "auto"
  },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontWeight: "bold"
  },
});

interface Prices {
  bs:number;
  dls:number;
  psos:number;
  type_code:string;
}

// Define las propiedades del recibo
interface ReceiptProps {
  number: string;
  entryDate: string;
  entryHour: string;
  type: string;
  plate: string;
  qrImage: string;
  pric: Prices[];
  paymentCoin: string;
}

const formatDate = (date: string): string => {
  const parts = date.split("/");
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
};

// Componente del PDF
const ReceiptPDF: React.FC<ReceiptProps> = ({ number, entryDate, entryHour, type, plate, qrImage, pric, paymentCoin }) => (
  <Document>
    <Page size={[165, "auto"]} style={styles.page}>
      <View>
        <Text style={{ textAlign: "center", fontSize: 10, fontWeight: "bold" }}>
          {import.meta.env.VITE_FIRST_HEADER}
        </Text>
        <Text style={{ textAlign: "center", fontSize: 10, fontWeight: "bold" }}>
          {/*import.meta.env.VITE_SECOND_HEADER*/}
          {"CENTRO CIVICO\nSAN CRISTOBAL"}
        </Text>
      </View>
      <View>
        <Text style={{ textAlign: "center", fontSize: 10 }}>
          ----------------------
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>NUMERO: </Text>
          <Text>{number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>TIPO: </Text>
          <Text>{type == "CARROS" ? "CARRO" : "MOTO"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>PLACA: </Text>
          <Text>{plate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>ENTRADA: </Text>
          <Text>{formatDate(entryDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>HORA: </Text>
          <Text>{entryHour}</Text>
        </View>
      </View>
      <View>
        <Text style={{ textAlign: "center", fontSize: 10 }}>
          ----------------------
        </Text>
      </View>
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold"}}>
          {"MONTO A CANCELAR\n"}
          {
            type == "CARROS"
            ? `${paymentCoin == "03" ? "[" : ""} ${pric[1].psos} ${paymentCoin == "03" ? "]" : ""} COP\n${paymentCoin == "02" ? "[" : ""} ${pric[1].dls} USD ${paymentCoin == "02" ? "]" : ""}\n${paymentCoin == "01" ? "[" : ""} ${pric[1].bs} VES ${paymentCoin == "01" ? "]" : ""}`
            : `${paymentCoin == "03" ? "[" : ""} ${pric[0].psos} ${paymentCoin == "03" ? "]" : ""} COP\n${paymentCoin == "02" ? "[" : ""} ${pric[0].dls} USD ${paymentCoin == "02" ? "]" : ""}\n${paymentCoin == "01" ? "[" : ""} ${pric[0].bs} VES ${paymentCoin == "01" ? "]" : ""}`
          }
        </Text>
      </View>
      <View>
        <Text style={{ textAlign: "center", fontSize: 10 }}>
          ----------------------
        </Text>
      </View>
      <View>
        <Image
          style={styles.image}
          src={{ uri: qrImage, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
        />
      </View>
      <View>
        <Text style={{ textAlign: "center", fontSize: 10 }}>
          ----------------------
        </Text>
      </View>
    </Page>
  </Document>
);

export default ReceiptPDF;

/*
        <Text
          style={{
            textAlign: "center"
          }}
        >
          TICKET EXTRAVIADO
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 6
          }}
        >
          CARROS 20.000 COP | MOTOS 10.000 COP
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 6
          }}
        >
          CENTRO CIVICO SAN CRISTOBAL
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 6
          }}
        >
          NO SE HACE RESPONSABLE
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 6
          }}
        >
          POR OBJETOS DE VALOR
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 6
          }}
        >
          DEJADOS EN EL VEHICULO
        </Text>
*/