const cors = require("cors");
const express = require("express");
const pool = require("./config/db.js");

const multer = require("multer");
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

//POST ROUTES
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

app.post("/setTicket/:correlative", async (req, res) => {
  const { correlative } = req.params;
  try {
    const ticket= await pool.query(`
      INSERT INTO tickets
        (car_correlative) 
      VALUES
        ($1) RETURNING *
      `,[correlative])
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
    return res.send("Error with database:", error);
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
    console.log(confirmation)
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
