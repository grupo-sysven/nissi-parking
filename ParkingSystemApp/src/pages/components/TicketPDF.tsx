//import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Define los estilos con un tamaño fijo de 58 mm de ancho
const styles = StyleSheet.create({
  page: {
    width: "58mm", // Ancho de 58 mm (configuración precisa)
    padding: "6mm",
    fontSize: 7,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  image: {
    width: "40mm", // Ajusta el tamaño de la imagen
    height: "40mm",
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontWeight: "bold",
  },
});

// Define las propiedades del recibo
interface ReceiptProps {
  number: string;
  entryDate: string;
  entryHour: string;
  type: string;
  plate: string;
  qrImage: string;
}

// Componente del PDF
const ReceiptPDF: React.FC<ReceiptProps> = ({ number, entryDate, entryHour, type, plate, qrImage }) => (
  <Document>
    <Page size={[165, "auto"]} style={styles.page}>
      <View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 7
          }}
        >
          {import.meta.env.VITE_FIRST_HEADER}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 7
          }}
        >
          {import.meta.env.VITE_SECOND_HEADER}
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text>NUMERO: </Text>
          <Text>{number}</Text>
        </View>
        <View style={styles.row}>
          <Text>FECHA DE ENTRADA: </Text>
          <Text>{entryDate}</Text>
        </View>
        <View style={styles.row}>
          <Text>HORA: </Text>
          <Text>{entryHour}</Text>
        </View>
        <View style={styles.row}>
          <Text>TIPO: </Text>
          <Text>{type=="CARROS"?"CARRO":"MOTO"}</Text>
        </View>
        <View style={styles.row}>
          <Text>PLACA: </Text>
          <Text style={{
            fontSize: 8
          }}>{plate}</Text>
        </View>
      </View>
      <View>
        <Image
          style={styles.image}
          src={{ uri: qrImage, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
        />
      </View>
      <View>
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
      </View>
    </Page>
  </Document>
);

export default ReceiptPDF;