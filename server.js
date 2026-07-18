const express=require("express");
const app=express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

app.use(express.json());//needed for parsing the json files from the users(to take input)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT=3000;

const tasks=[{"id":1,"title":"Learning Express","done":false},{"id":2,"title":"Build API","done":true}
    ,{"id":3,"title":"Push to Github","done":false}];

app.get("/tasks",(req,res)=>{
    res.json(tasks);
});

app.get("/tasks/:id",(req,res)=>{
    const i=parseInt(req.params.id);
    const task=tasks.find(task=>task.id==i);
    if(!task)
    {
        return res.status(404).json({ "error": `Task ${i} not found` });
    }
    res.json(task);
});

app.get("/",(req,res)=>{
    res.json({
         "name": "Task API", 
         "version": "1.0", 
         "endpoints": ["/tasks"] 
        });
});

app.get("/health",(req,res)=>{
    res.json({
        "status":"ok"
    });
});

app.post("/tasks",(req,res)=>{
    const {title}=req.body;

    if(!title || title.trim()==="")
    {
        res.status(404).json({
            "error":"Title is required"
        });
    }

    const nextId=tasks.length>0?Math.max(...tasks.map(task=>task.id))+1:1;

    const newTask={
        "id": nextId,
        "title":title.trim(),
        "done":false
    }

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const task = tasks.find(task=>task.id===id);

    if(!task)
    {
        return res.status(404).json({
            "error":`Task ${id} not found`
        });
    }

    const {title , done}=req.body;

    if ((title === undefined && done === undefined) ||
    (title !== undefined && title.trim() === "") ||
    (done !== undefined && typeof done !== "boolean")) {
        return res.status(400).json({
                "error" : "Provide a valid title and/or done value"
        });
    }

    if(title!=undefined)
    {
        task.title=title.trim();
    }

    if(done!=undefined)
        task.done=done;

    res.json(task);
});

app.delete("/tasks/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const index=tasks.findIndex(task=>task.id===id);
    if(index==-1)
    {
        return req.status(404).json({
            "error":`Task ${id} not found`
        });
    }

    tasks.splice(index,1);

    res.status(204).send();
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});