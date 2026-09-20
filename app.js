import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './openapi.json' with {type: "json"};

const app = express();

const port = 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const tasks = [{
    id: 1,
    title: "create a file",
    done: false
}, {
    id: 2,
    title: "create a folder",
    done: true
    
}, {
    id: 3,
    title: "clean the laptop",
    done: false

}];

app.get("/", (req, res) => {
    res.status(200).json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    })
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    })
});

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const { id } = req.params;

    if(!id || isNaN(id)){
        return res.status(400).json({
            error: "Please enter valid id"
        })
    };

    const task = tasks.find(task => task.id === Number.parseInt(id));

    if(!task){
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    };

    res.status(200).json(task);
});

let nextId = 4;

app.post("/tasks", (req, res) => {
    const title = req.body?.title;

    if(typeof(title) !== "string" || title.trim() === ""){
        return res.status(400).json({error: "title is required"});
    }

    const newTask = {
        id: nextId++,
        title,
        done: false
    }

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const title = req.body?.title;
    const isDone = req.body?.done;

    if(!id || isNaN(id)){
        return res.status(400).json({
            error: "Please enter valid id"
        }) 
    };

    if (title === undefined  && isDone === undefined) {
        return res.status(400).json({ error: "Provide title or done to update the task" });
    }

    if(title !== undefined && (typeof(title) !== "string" || title.trim() === "")){
        return res.status(400).json({ error: "title must be a non-empty string"})
    }

    const indexOfTask = tasks.findIndex(task => task.id === Number.parseInt(id));

    if(indexOfTask === -1){
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    };

    if(isDone !== undefined && typeof(isDone) !== "boolean"){
        return res.status(400).json({
            error: "Please enter valid done"
        })
    };

    if(isDone !== undefined){
        tasks[indexOfTask].done = isDone;
    }

    if(title !== undefined){
        tasks[indexOfTask].title = title;
    }

    res.status(200).json(tasks[indexOfTask]);
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    const indexOfTask = tasks.findIndex(task => task.id === Number.parseInt(id));

    if(indexOfTask === -1){
        return res.status(404).json({ message: "task not found"});
    }

    tasks.splice(indexOfTask, 1);

    res.status(204).end();
})

app.listen(port, () => {
    console.log(`Your app is listening on port ${port}`)
})