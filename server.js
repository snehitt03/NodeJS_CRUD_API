const express=require("express");
const app=express();

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

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});