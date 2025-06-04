import express, { Request, Response } from "express"
import dotenv from "dotenv"
import { listaTODOs, TODO } from "./data"
import bodyParser from "body-parser"
import cors from "cors"

dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static("assets"))
const PORT = process.env.PORT
app.use(cors())

app.get("/", (req : Request, resp : Response) => {
    resp.send("Endpoint raiz")
})

app.get("/todos", (req : Request, resp : Response) => {
    const todos = listaTODOs
    resp.json(todos)
})

app.get("/todos/:id", (req : Request, resp : Response) => {
    const id = req.params.id

    let todoEncontrado : TODO | null = null
    for (let todo of listaTODOs) {
        if (todo.id.toString() == id) {
            todoEncontrado = todo
            break;
        }
    }

    if (todoEncontrado == null) {
        // Error: no se encontro
        resp.status(400).json({
            msg : "Codigo incorrecto"
        })
    }

    resp.json(todoEncontrado)
})

app.post("/todos", (req : Request, resp : Response)=>{
    const todo = req.body // obtiene de frontend

    const todos = listaTODOs
    
    if (todo.descripcion == undefined){
        resp.status(400).json({
            msg: "Debe enviar campo descripcion"
        })
        return
    }

    todos.push({
        descripcion : todo.descripcion,
        id: new Date().getTime()
    })

    resp.json({
        msg: ""
    })
})

app.put("/todos/:id", (req : Request, resp : Response)=> {
    const todo = req.body
    const todoId = req.params.id
    const todos = listaTODOs

    // validaciones
    if (todoId == undefined){
        resp.status(400).json({
            msg: "debe enviar un id como parte del path"
        })
        return;
    }

    if (todo.descripcion == undefined){
        resp.status(400).json({
            msg: "debe enviar una descripcion"
        })
        return;
    }
    
    for (let t of todos){
        if (t.id.toString() == todoId){
            t.descripcion = todo.descripcion
            resp.json({
                msg : ""
            })
            return;
        }
    }
    resp.status(400).json({
        msg: "no existe todo con ese id"
    })
})

app.delete("/todos/:id", (req: Request, resp: Response)=>{
    const todoId = req.params.id
    let todos = listaTODOs
    const indiceAEliminar = listaTODOs.findIndex((T: TODO)=>{
        return T.id.toString() == todoId // almacena la primera posicion q dice true o -1 si no lo encuentra
    })
    
    if (indiceAEliminar == -1){
        resp.status(400).json({
            msg: "no existe con ese id"
        })
        return
    }

    todos.splice(indiceAEliminar,1)
    resp.json({
        msg: ""
    })
    
    /*
    const todosFiltrados = listaTODOs.filter((t: TODO, indice: number)=>{
        return t.id.toString() != todoId
    }) // retorna los que no son iguales (elimina los q si son iguales)

    listaTODOs = todosFiltrados // no se puede xq es const y no podemos let xq es import asi que */

    /*let indice = 0
    for (let t of todos){
        if (t.id.toString() == todoId){
            todos.splice(indice, 1) //desde que posicion y cuantos elementos elimina
            resp.json({
                msg : ""
            })
            break;
        }
        indice++;
    } 
    resp.status(400).json({
        msg: "No existe todo con ese id"
    }) */
    
    
})

app.listen(PORT, () => {
    console.log(`Se inicio servidor en puerto ${PORT}`)
})