const Hapi = require("@hapi/hapi");
const mongoose  = require('mongoose'); 
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('connected to db'))
.catch((err)=>console.log(err))

 const init = async () => {
     const server = Hapi.server({
     host : 'localhost',
     port : '3000'
   });

   const taskSchema = new mongoose.Schema( {
       taskName : {
           type : String,
           required : true
       }
     }
   )

   const taskModel = mongoose.model('tasks',taskSchema);
   // GET A SINGLE TASK   
   server.route({
       method : 'GET',
       path : '/api/tasks/{id}',
       handler : async(req,res) => {
           try{
               let taskId =  req.params.id;
               let foundTask = await taskModel.findOne({_id:taskId});
               return res.response(foundTask);
           }catch(err){
               return res.response(err)
           }   
        }
});

// GET ALL TASKS
   server.route({
        method : 'GET',
       path : '/api/tasks',
       handler : async(req,res) => {
        try{
               let foundTasks = await taskModel.find({});
               return res.response(foundTasks);
           }catch(err){
               return res.response(err)
           }
       }
   });

// CREATE
   server.route({
       method : 'POST',
       path : '/api/task',
       handler : async(req,res) => {
          try{
              let newTask = new taskModel(req.payload);
             let result =  await newTask.save();
              return res.response(result);
          }catch(err){
              return res.response(err)
          }

       }
   });

    // UPDATE TASK
   server.route({
       method :'PUT',
       path : '/api/tasks/{taskId}',
       handler : async(req,res) => {
          try{
              let taskId =  req.params.taskId;
            let  updatedTask = await taskModel.findOneAndUpdate({_id:taskId},req.payload,{new:true,runValidators:true});
              return res.response(updatedTask);
          }catch(err){
              return res.response(err)
          }
       }
   });


 // DELETE
   server.route({
       method :'DELETE',
       path : '/api/tasks/{taskId}',
       handler : async(req,res) => {
          try{
              let taskId =  req.params.taskId;
            let  removedTask = await taskModel.findOneAndDelete({_id:taskId});
              return res.response(removedTask);
          }catch(err){
              return res.response(err)
          }
       }
   });

   await server.start();
   console.log('server running on %s ' , server.info.uri);
}

process.on('unhandledRejection',(err)=>{
    console.log(err);
    process.exit(1);
}
);

 init();