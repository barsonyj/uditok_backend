import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

let con = null;
try {
    con = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: 3306,
        database: "uditok",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
     });
} catch (error) {
    console.log(error);
}

const app = express();
app.use(express.json());
app.use(cors());

async function getUditok(req, res) {
    try {
        let sql = "select * from uditok";
        const [ json ] = await con.query(sql);
        res.send(json);
    } catch(error) { res.status(500).send({ error:error }); }
}

async function postUdito(req, res) {
    if (req.body.nev && req.body.meret && req.body.kep) {
        try {
            let sql = `insert into uditok set nev="${req.body.nev}", meret=${req.body.meret}, kep="${req.body.kep}"`;
            const [ json ] = await con.query(sql);
            res.send(json);
        } catch(error) { res.status(500).send({ error:error }); }
    } else res.status(400).send({ error:"Hiányos paraméterek!" });
}

async function deleteUdito(req, res) {
    if (req.params.uaz) {
        try {
            let sql = `delete from uditok where uaz=${req.params.uaz}`;
            const [ json ] = await con.query(sql);
            res.send(json);
        } catch(error) { res.status(500).send({ error:error }); }
    } else res.status(400).send({ error:"Hiányos paraméterek!" });
}

app.get("/", (req, res) => res.send("<h1>Üdítők v1.0.0</h1>"));
app.get("/uditok", getUditok);
app.post("/udito", postUdito);
app.delete("/udito/:uaz", deleteUdito);

const port = process.env.PORT || 88;
app.listen(port, (error) => {
    if (error) console.log(error); else console.log("Server on " + port);
});