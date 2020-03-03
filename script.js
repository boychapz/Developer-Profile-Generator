const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
//const generateHTML = require("./generateHTML");
const options = { format: "Letter", charset: "utf-8" };
const Pdf = require("html-pdf");

const writeFileAsync = util.promisify(fs.writeFile);
const questions = [
  {
    name: "username",
    type: "input",
    message: "What's your Github username?"
  },
  {
    name: "color",
    type: "checkbox",
    message: "select a prefered color",
    choices: ["red", "green", "blue", "yellow"]
  }
];
function generate() {
  inquirer.prompt(questions).then(function(result) {
    console.log(result);

    const queryURL = `https://api.github.com/users/${result.username}`;

    axios.get(queryURL).then(function(answer) {
      console.log(answer.data);
      console.log(answer.data.blog);

      var generateHtml = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Developer Profile Generator</title>
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
          />
          <script src="https://kit.fontawesome.com/yourcode.js"></script>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
            }
            #profile {
              height: 150px;
              width: 150px;
              text-align: center;
              display: block;
              margin-left: auto;
              margin-right: auto;
              border: 2px solid blue;
              padding: 4px;
            }
      
            .top-container {
              background: ${result.color};
            }
      
            @media screen and (max-width: 600px) {
              .column {
                width: 100%;
                display: block;
                margin-bottom: 20px;
              }
            }
            .card {
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
              padding: 16px;
              margin-bottom: 10px;
              text-align: center;
              background-color: ${result.color};
            }
          </style>
        </head>
        <body>
          <div class="container text-center top-container">
            <img
              id="profile"
              class="rounded-circle"
              src="https://github.com/${result.username}.png"
              alt="profilepic"
            />
      
            <h2>Hi!</h2>
            <h2>My Name is ${answer.data.name}</h2>
            <p>
              ${answer.data.bio}
            </p>
            <p>
              <a
                href="https://www.google.com/maps/@?api=1&map_action=map&query=${answer.data.location}"
                target="_blank"
                >${answer.data.location}</a
              >
              <a
                class="fa fa-github"
                href="https://github.com/boychapz"
                target="_blank"
                ><i class="fa fa-github" aria-hidden="true"></i>GitHub</a
              >
              
            </p>
          </div>
      
          <div class="container text-center">
            <h2 style="color: royalblue;">More about me</h2>
            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <h3 class="card-title">Public Repository</h3>
                  <p class="card-text">${answer.data.public_repos}</p>
                </div>
              </div>
      
              <div class="col-md-6">
                <div class="card">
                  <h3 class="card-title">Followers</h3>
                  <p class="card-text">${answer.data.followers}</p>
                </div>
              </div>
            </div>
      
            <div class="row">
              <div class="col-md-6">
                <div class="card">
                  <h3 class="card-title">Github Stars</h3>
                  <p class="card-text">${answer.data.public_gists}</p>
                </div>
              </div>
      
              <div class="col-md-6">
                <div class="card">
                  <h3 class="card-title">Following</h3>
                  <p class="card-text">${answer.data.following}</p>
                </div>
              </div>
            </div>
          </div>
          <script
            src="https://code.jquery.com/jquery-3.4.1.js"
            integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
            crossorigin="anonymous"
          ></script>
          <script
            src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
            integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
            crossorigin="anonymous"
          ></script>
          <script type="text/JavaScript" src="index.js"></script>
        </body>
      </html>`;

      writeFileAsync("index2.html", generateHtml)
        .then(function() {
          console.log("successfully written to HTML");
        })
        .catch(function(err) {
          console.log(err);
        });
      Pdf.create(generateHtml, options).toFile("./resume.pdf", function(
        err,
        res
      ) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/resume.pdf' }
      });
    });
  });
}
generate();
