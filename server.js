const express = require("express")
const mysql = require("mysql")
const BodyParser = require("body-parser")

const app = express()

const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.use(BodyParser.urlencoded({extended:true}))

app.set("view engine", "ejs")
app.set("views", "views")

const db = mysql.createConnection({
    host : "localhost",
    database : "school",
    user : "root",
    password : ""
})

db.connect((err)=>{
    if (err) throw err
    console.log("database connected...")
        // untuk get data
        app.get("/", (req, res) =>{
            const sql = "SELECT*FROM user"
            db.query(sql, (err, result) =>{
            const users = JSON.parse(JSON.stringify(result))
            res.render("index", {users : users, title:"Daftar Murid"})
        })
    })

        // untuk insert data
        app.post("/tambah", (req,res) => {
            const insertSql = `INSERT INTO user (name, kelas) VALUES ('${req.body.nama}','${req.body.kelas}')`;
            db.query(insertSql,(err, result)=>{
                if(err) throw err
                res.redirect('/')
                
            })
        })

        app.get("/chat",(req,res)=>{
            res.render("chat",{loginTitle : "Masuk Forum", chatRoomTitle : "DiskusiTerbuka"})
        })
   

   
})

io.on("connection", (socket) => {
    socket.on("message",(data)=>{
        console.log(data)
        const {id, message} = data
        socket.broadcast.emit("message", id, message)
    })
})

server.listen(8000, () => {
    console.log('ready...')
})