const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../prisma/generated/prisma-client')
const resolvers = require('./resolvers')
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
var cors = require('cors')
const multer = require("multer");

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

server.start(() => console.log('Server is running on http://localhost:4000'))


//================================= IMAGE SERVER SECTION =================================//


const app = express();

app.use(express.json());
app.use(cors())

const httpServer = http.createServer(app);
const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`Image server is listening on port ${PORT}`);
});

const upload = multer({dest: path.join(__dirname, "../../src/images/")});

const type = upload.single('myImage');

app.post("/upload", type, function (req,res) {
  const tmp_path = req.file.path;
  const date = Date.now();
  const target_path = path.join(__dirname, "../../src/images/") + date + req.file.originalname;
  fs.copyFile(tmp_path, target_path, (err) => {
    if (err) throw err;
    console.log(`File was copied to ${target_path}`);
    fs.unlink(tmp_path, (err) => {
      if (err) throw err;
      console.log(`File: ${tmp_path} was deleted`);
    });
    res.send('File Uploaded/' + date + req.file.originalname);
  });
});
