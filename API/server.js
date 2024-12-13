const cors = require("cors");
const express = require("express");
const pool = require("./config/db.js");

const multer = require("multer");
const ExcelJS = require('exceljs')
const { print } = require("pdf-to-printer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = ".pdf";
    const filename = `receipt_${Date.now()}${extname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const moment = require('moment');

const formatter = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});

//GET ROUTES
app.get("/getFalseTickets", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tickets.correlative, date, entry_date, car.plate, type.description 
        FROM tickets
      INNER JOIN car
        ON car.correlative=tickets.car_correlative
      INNER JOIN type
        ON car.type_code=type.code
        WHERE status=false
      `);
    
    const formattedRows = result.rows.map(row => {
      return {
        ...row,
        date: moment(row.date).format("DD/MM/YYYY"),
        entry_date: moment(row.entry_date).format("DD/MM/YYYY HH:mm:ss")
      };
    });

    res.json(formattedRows);
  } catch (err) {
    res.status(500).send("Error with database: " + err.message);
  }
});

app.get("/getTicketInfo/:correlative", async(req, res)=>{
  const { correlative }= req.params
  try {
    const result = await pool.query(`
      SELECT tickets.correlative, date, entry_date, car.plate, type.description 
        FROM tickets
      INNER JOIN car
        ON car.correlative=tickets.car_correlative
      INNER JOIN type
        ON car.type_code=type.code
        WHERE tickets.correlative=$1
        `,[correlative])

    const date=formatter.format(result.rows[0]["date"])
    const entry_date=formatter.format(result.rows[0]["entry_date"])
    
    // result.rows[0]["date"]= date
    // result.rows[0]["entry_date"]= entry_date
    
    res.json(result.rows[0])
  } catch (error) {
    res.send("Error with database:", error);
  }
})

app.get("/getTypes", async(req, res)=>{
  try {
    const result = await pool.query("SELECT * from type");
    res.json(result.rows);
  } catch (err) {
    res.send("Error with database:", err);
  }

})

app.get("/getAllTickets", async (req, res) =>{
  try {
    const tickets = await pool.query("SELECT COUNT(status), status FROM tickets GROUP BY status");
    res.json(tickets.rows)
  } catch (error) {
    res.send("Error with database:", error);
  }
})

app.get("/getPrices", async (req, res) => {
  try {
    const result = await pool.query(`
      select 
        MAX(case when coin_code ='01'then price end) as bs, 
        MAX(case when coin_code='02' then price end) as dls, 
        MAX(case when coin_code='03' then price end) as psos, 
        type_code 
      from prices group by type_code;
      `)
    res.json(result.rows)
  } catch (error) {
    res.send("Error with database:", error);
  }
})

app.get("/getCars", async (req,res) => {
  try {
    const result= await pool.query(`
      SELECT correlative, plate, type.description FROM car
      INNER JOIN type on
      car.type_code=type.code
    `)
    res.json(result.rows)
  } catch (error) {
    console.log(error)
    return res.send(error)
  }
})

app.get("/report/today",async(req,res)=>{
  const today= new Date().toLocaleDateString()
  try {
    const ticketsToday= await pool.query(`SELECT 
        tickets.correlative as "NRO", 
        car.plate as "PLACA", 
        type.description as "TIPO", 
        MAX(CASE WHEN tickets_coins.coin_correlative = '01' THEN tickets_coins.total END) AS "BOLIVARES",
        MAX(CASE WHEN tickets_coins.coin_correlative = '02' THEN tickets_coins.total END) AS "DOLARES",
        MAX(CASE WHEN tickets_coins.coin_correlative = '03' THEN tickets_coins.total END) AS "PESOS"
        FROM tickets
        INNER JOIN car ON car.correlative = tickets.correlative
        INNER JOIN type ON car.type_code = type.code
        INNER JOIN tickets_coins ON tickets_coins.main_correlative = tickets.correlative
        WHERE tickets.status = true
        AND (tickets.out_date >= '${today} 00:00:00' and tickets.out_date <= '${today} 11:59:00')
        GROUP BY tickets.correlative, car.plate, type.description
        ORDER BY tickets.correlative asc;
    `)
    res.json(ticketsToday.rows)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//POST ROUTES
app.post('/utils/generate-report', async (req, res) => {
  const { todayTick, sumTotals } = req.body
  const today= new Date().toLocaleDateString()
  //console.log(todayTick, sumTotals)
  returnung= {
    "TICKETS":todayTick,
    "TOTALES":sumTotals
  }
  console.log(returnung)
  try {
      // Crear un nuevo Workbook y Worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Report-${today}`);

      // Definir las columnas del archivo Excel
      worksheet.columns = [
          { header: 'NRO', key: 'NRO', width: 10 },
          { header: 'PLACA', key: 'PLACA', width: 30 },
          { header: 'TIPO', key: 'TIPO', width: 10 },
          { header: 'BOLIVARES', key: 'BOLIVARES', width: 20 },
          { header: 'DOLARES', key: 'DOLARES', width: 20 },
          { header: 'PESOS', key: 'PESOS', width: 20 },

      ];

      // Agregar datos de ejemplo (puedes reemplazar esto con datos reales)
      todayTick.forEach((item) => worksheet.addRow({
        NRO: item.NRO,
        PLACA: item.PLACA,
        TIPO: item.TIPO,
        BOLIVARES: item.BOLIVARES,
        DOLARES: item.DOLARES,
        PESOS: item.PESOS,
      }));

      // Agregar fila de sumas al final
      worksheet.addRow({
        NRO: 'TOTAL',
        PLACA: '',
        TIPO: '',
        BOLIVARES: sumTotals.bolivares.toFixed(2),
        DOLARES: sumTotals.dolares.toFixed(2),
        PESOS: sumTotals.pesos.toFixed(2),
      });

      // Agregar estilos (opcional)
      worksheet.getRow(1).font = { bold: true }; // Encabezado en negrita

      // Guardar el archivo en un buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Configurar el encabezado para descarga
      res.setHeader(
          'Content-Disposition',
          `attachment; filename="report${today}.xlsx"`
      );
      res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      // Enviar el archivo al cliente
      res.send(buffer);
  } catch (error) {
      console.error('Error generando el archivo Excel:', error);
      res.status(500).send('Error al generar el archivo Excel');
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  const filePath = req.file.path;
  console.log("Archivo guardado en:", filePath);
  print(filePath, { printer: "Microsoft Print to PDF" })
  .then(() => {
    console.log("Impresión completada");
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo:", err);
      } else {
        console.log("Archivo eliminado correctamente");
      }
    });
  })
  .catch((err) => {
    console.error("Error al imprimir:", err);
  });
});

app.post("/setCar", async (req, res)=>{
  const plate=req.body["plate"]
  let type=req.body["type"]
  if(plate==""){
    return res.send(false)
  }
  try{
    const find= await pool.query("SELECT * FROM car WHERE plate=$1",[plate])
    if (find.rowCount === 0) {
      try {
        //console.log(`NRO DE PLATA: ${plate} y tipo ${type} NO ENCONTRADO NECESARIO INSERTAR`)
        const car = await pool.query("INSERT INTO car(plate, type_code) VALUES($1,$2) RETURNING *",[plate, type])
        //console.log(`INSERTADO ${plate} y tipo ${type}`)
        res.status(201).json(car.rows[0])
      } catch (err){
        return res.send("Error with database:", err);
      }
    }else{
      type=find.rows[0]["type_code"];
      res.json(find.rows[0])
    }
  }catch(err){
    return res.send("Error with database:", err);
  }
})

app.post("/setTicket", async (req, res) => {
  const correlative = req.body.correlative;
  const entry_date = req.body.date;
  try {
    const ticket= await pool.query(`
      INSERT INTO tickets
        (car_correlative, entry_date) 
      VALUES
        ($1,$2) RETURNING *
      `,[correlative,entry_date])
    const correlativeTicket= ticket.rows[0]["correlative"]
    const pdfData= await pool.query(
    `SELECT tickets.correlative, date, entry_date, car.plate, type.description 
      FROM tickets INNER JOIN car ON
      car.correlative=tickets.car_correlative
      INNER JOIN type ON
      car.type_code=type.code
      WHERE tickets.correlative=$1`,[correlativeTicket])
    res.status(201).json(pdfData.rows[0])
  } catch (error) {
    console.error("Error with database:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

app.post("/updateTicket/:correlative", async (req, res) => {
  const now = new Date();
  const { correlative } = req.params;
  
  //1000 FRAMEWORKS PERO NO PUEDES OBJETENER LA FECHA ACTUAL FUKIN JS
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const day = String(now.getDate()).padStart(2, '0'); 
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0'); 
  const sec = String(now.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}/${month}/${day} ${hour}:${min}:${sec}`;
  confirmation=null
  try {
    confirmation=await pool.query(`SELECT * FROM tickets where correlative=$1`,[correlative])
    console.log("NRO DE TICKET A REGISTRAR: ",confirmation.rows[0]["correlative"])
  } catch (error) {
    confirmation=null
  }
  try {
    if (confirmation==null){
      res.send({status:true})
    }else{
      if(confirmation.rows[0]["out_date"]==null){
        await pool.query(`
          UPDATE public.tickets
          SET out_date=$1, status=true
          WHERE correlative=$2
        `, [formattedDate, correlative]);
        const updateTick= await pool.query(
          `SELECT tickets.correlative, date, entry_date, tickets.out_date,car.plate, type.description 
            FROM tickets INNER JOIN car ON
            car.correlative=tickets.car_correlative
            INNER JOIN type ON
            car.type_code=type.code
            WHERE tickets.correlative=$1`,[correlative])
        res.json(updateTick.rows[0]);
      } else{
        res.send({status:false})
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error with database: " + error.message);
  }
});

app.post("/updatePrice", async (req, res) =>{
  const pricebs= req.body["pricbs"]
  const pricedls= req.body["pricdls"]
  const pricepsos = req.body["pricpsos"]
  const type_code= req.body["type"]
  const coin_code= req.body["con"]

  try {
    if (pricebs!=undefined){
      if (typeof(pricebs) === "number"){
        const update= await pool.query(`
        UPDATE public.prices
        SET price=$1
        WHERE type_code=$2 and coin_code=$3 RETURNING *;
        `, [pricebs, type_code, coin_code])
        res.send(update)
      }else{
        res.status(200).send({"ok":false})
      }
    }
    if (pricedls!=undefined) {
      if (typeof(pricedls) === "number"){
        const update= await pool.query(`
        UPDATE public.prices
        SET price=$1
        WHERE type_code=$2 and coin_code=$3 RETURNING *;
        `, [pricedls, type_code, coin_code])
        res.send(update)
      }else{
        res.status(200).send({"ok":false})
      }
    }
    if (pricepsos!=undefined) {
      if (typeof(pricepsos) === "number"){
        const update= await pool.query(`
        UPDATE public.prices
        SET price=$1
        WHERE type_code=$2 and coin_code=$3 RETURNING *;
        `, [pricepsos, type_code, coin_code])
        res.send(update)
      }else{
        res.status(200).send({"ok":false})
      }
    }
  } catch (error) {
    res.send("Error with database:", error);
  }
})


app.listen(port);
console.log(`http://localhost:${port}`);
