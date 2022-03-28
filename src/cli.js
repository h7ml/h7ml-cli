// #!/usr/bin/env node
const inquirer = require("inquirer"); // 用于与命令行交互
const fs = require("fs"); // 用于处理文件
const path = require("path"); // 用于处理路径
const ejs = require("ejs"); // 用于解析 ejs 模板
const { Transform } = require("stream"); // 用于流式传输

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "file name?",
    },
    {
      type: "input",
      name: "title",
      message: "document title?",
    },
  ])
  .then((answers) => {
    const fileName = answers.name;
    const title = answers.title;
    const tempPath = path.join(__dirname, "template.html"); // 获取模板文件的路径
    const filePath = path.join(__dirname, fileName + ".html"); // 创建新文件的路径
    const read = fs.createReadStream(tempPath); // 读取模板文件中的内容
    const write = fs.createWriteStream(filePath); // 创建新文件
    const transformStream = new Transform({
      transform: (chunk, encoding, callback) => {
        const input = chunk.toString(); // 模板内容
        const output = ejs.render(input, { title }); // 解析模板
        callback(null, output);
      },
    });
    read.pipe(transformStream).pipe(write);
  });
