import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import QRCode from "qrcode";

interface PDFinformation {
    correlative:number;
    date: string;
    description:string;
    entry_date: string;
    plate:string;
  }

const styles = StyleSheet.create({
  view:{
    display:'flex',
    alignContent:'center'
  },
  img:{
    width:40,
    height:40,
  }
})

const genQr = async (text:string) =>{
  try {
    const qr=await QRCode.toDataURL(text)
    console.log(text)
    return qr
  } catch (error) {
    console.log(error)
  }
}

// Create Document Component
const PDF: React.FC<PDFinformation> = ({
    correlative,
    date, 
    description, 
    entry_date, 
    plate,
}) => (<Document pageMode='fullScreen' title={plate} author='GRUPO SYSVEN' keywords={`TICKET${plate}`} creator='GRUPO SYSVEN' pdfVersion='1.3' language='spanish'>
    <Page size="C8" wrap={false} style={{padding:'5'}}>
      <View style={[styles.view, {textAlign:'center', fontSize:5}]}>
        <Text>CENTRO CIVICO SAN CRISTOBAL</Text>
        <Text>Nro: {correlative}</Text>
        <View style={{textAlign:'left'}}>
          <Text>FECHA: {moment(date).format("YYYY/MM/DD")}</Text>
          <Text>TIPO: {description}</Text>
          <Text>HORA DE ENTRADA: {moment(entry_date).format("HH:mm:ss")}</Text>
          <Text>PLACA: {plate}</Text>
        </View>
        <Image src={genQr(`${correlative}`)} style={[styles.img, {marginHorizontal:'auto'}]}/>
        <Text style={{fontSize:3, fontWeight:'bold'}}>TICKET EXTRAVIADO: VEHICULOS:2000cop / MOTOS:1000cop</Text>
        <Text style={{fontSize:3, fontWeight:'bold'}}>CENTRO CIVICO SAN CRISTOBAL NO SE HA RESPONSABLE POR OBJETOS DE VALOR DEJADOS EN EL VEHICULO O MOTO</Text>
      </View>
    </Page>
  </Document>
  );
  

// eslint-disable-next-line react-refresh/only-export-components
export default PDF;