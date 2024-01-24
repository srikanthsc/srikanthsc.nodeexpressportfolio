//Server that initializes the http connection for the website
const fs = require("fs");
const express = require('express');
const jsonmark = require('jsonmark')
const port = process.env.PORT || 3000
// const scripts = require('./scripts/module.js')
//The template content is used so much, it deserves it's own variable so we automatically have it
const templateContent = require('./JSON/template.json')
//Initialize the server
const app = express();
app.use(express.static("scripts"))
app.set('view engine', 'pug')
app.set('views','./content/views')
// app.locals.toggleDropdown=scripts.toggleDropdown
//callback methods for when a client connects to a certain page

//Back-end files, must be loaded first
app.get('/scripts.js', (req,res) => { findSpecificFile('./scripts/scripts.js',req,res)});
// app.get('/index.css', (request,response) => { findSpecificFile('css/index.css',request,response)});

//TODO Bootstrap 5?
//Mandatory callback for the home page. Since home IS the root, it needs a special pattern match case
app.get('/', (req,res) =>{  renderContent('./content/md/main/index.md','main/index',res)});
//Loads a main branch
app.get('/:main', (req,res) => {
    switch(req.params.main){
        // case "blog":    return renderContent(`./content/md/main/${req.params.main}.md`, `main/${req.params.main}`,res,require('./JSON/blogposts.json'))
        case "projects": return renderContent(`./content/md/main/${req.params.main}.md`, `main/${req.params.main}`,res,require('./JSON/projectposts.json'))
    }
    return renderContent(`./content/md/main/${req.params.main}.md`,`main/${req.params.main}`,res)
});
//Loads branches from main branches, mainly blog posts
app.get('/:main/:name', (req,res)=>{
    var view=req.params.name, branch=req.params.main
    switch (req.params.main) {
        //If the request is for a document
        case "doc": return  findPDF(`./content/doc/${req.params.name}`,res)
        //If the request is for a blog or project post page.
        // case "blog": 
        case "projects":
            branch="posts"
            view="post-template"
            break;
    }
    renderContent(`./content/md/${req.params.main}/${req.params.name}.md`,`${branch}/${view}`,res)
});
//Loads pictures
app.get('/images/:main/:pic', (req,res)=>{  findSpecificFile(`./content/images/${req.params.main}/${req.params.pic}`,res)});
//Everything invalid is handled with a 404 page.
app.get('/*', (req,res)=>{renderContent('./content/md/main/404.md','main/404',res);});

//Allows for the pug files to read in the JSON content
module.exports=app;

//Listen for incoming client connections
//For deployment on heroku, the port will be `process.env.PORT`. If localhost, the port is 8888
app.listen(port, () => console.log(`Server is listening on port ${port}...`));

/*---------------------Functions/Methods--------------------------- */
/*
* This part is very dense. This parses the markdown buffer "content" from the file to JSON. Then, the 
* content is converted to a string in order to clean up any # present in the headers. Then, the string
* is parsed back into JSON*/
function parseMDContent(content){
    return JSON.parse(
        (JSON.stringify(jsonmark.parse(content), null, ' '))
        .replace(/# |## |### /gi,""))
}
/*This function gathers necessary information for a webpage and renders it */
function renderContent(MDfilepath,view,res,moreContent={}){
    console.log(`Retrieving ${MDfilepath}`)
    //Reads in a markdown file to parse from
    fs.readFile(MDfilepath, (err,content)=>{
        //Renders the 404 page if the markdown file cannot be opened or read.
        if(err)     return renderContent('./content/md/main/404.md','main/404',res);
        //parseMDContent gets the markdown content in JSON format
        //Object.assign() compiles all content together into a single JSON object
        //At the end, the pug file is rendered with the associated content
        res.render(view, Object.assign(templateContent,parseMDContent(content.toString()),moreContent));
    });
}

/*Loads the contents of some file to the client with a direct filepath*/
function findSpecificFile(filePath, res){
    fs.readFile(filePath, function(err,content){
        console.log(`Retrieving ${filePath}`)
        // if(err)     throw err;
        if(err)     return renderContent('./content/md/main/404.md','main/404',res);
        res.end(content); 
    });
}
/*Loads contents of a PDF file to the client*/
function findPDF(filePath,res){
    console.log(`Retrieving ${filePath}`)
    var file = fs.createReadStream(filePath);
    var stat = fs.statSync(filePath);
    res.setHeader('Content-Length', stat.size)
        .setHeader('Content-Type', 'application/pdf')
        .setHeader('Content-Disposition', 'attachment; filename=')
    file.pipe(res);
}