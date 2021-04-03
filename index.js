const fs = require("fs");
const { execSync } = require("child_process");

//Dependencies
const inquirer = require("inquirer");
const replace = require("replace-in-file");
const chalk = require("chalk");

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: "project-choice",
    type: "list",
    message: "What type of api server template would you like to generate?",
    choices: CHOICES.reverse(),
  },
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        const fileExists = fs.existsSync(`${CURR_DIR}/${input}`);
        if (!fileExists) {
          return true;
        } else {
          return "Folder Aleady Exist!!!";
        }
      } else {
        return "Project name may only include letters, numbers, underscores and hashes.";
      }
    },
  },
  {
    name: "database-name",
    type: "input",
    message: "Database name:",
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const databaseName = answers["database-name"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);

  const options = {
    files: [
      `${CURR_DIR}/${projectName}/.env.dev`,
      `${CURR_DIR}/${projectName}/.env.prod`,
      `${CURR_DIR}/${projectName}/README.md`,
      `${CURR_DIR}/${projectName}/package.json`,
    ],
    from: [/:::DATABASE_NAME:::/g, /:::PROJECT_NAME:::/g],
    to: [databaseName, projectName],
  };

  try {
    replace.sync(options);
  } catch (error) {
    console.error("Error occurred:", error);
  }

  console.log(chalk.green("Have Successfully Created the Server"));

  npmDevStart(projectName);
});

function npmDevStart(newPath) {
  try {
    const child = execSync(
      `cd ${CURR_DIR}/${newPath} && npm install && npm run dev`,
      {
        stdio: "inherit",
      }
    );

    const handleExit = () => {
      console.log("inside exit");

      child.kill("SIGTERM");
      process.exit(1);
    };

    child.on("exit", handleExit);
    child.on("SIGTERM", handleExit);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      if (file === ".npmignore") file = ".gitignore";
      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });
}
