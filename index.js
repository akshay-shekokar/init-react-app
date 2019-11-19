#!/usr/bin/env node
let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs') //fs already comes included with node.

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`
let configTemplates = require('./templates/templates.js')
let publicTemplates = require('./templates/public/templates.js');
let srcTemplates = require('./templates/src/templates.js');

const run = async () => {
    try {
        log("creating react-simple-boilerplate");
        await createDirectory(appName);
        await cdIntoNewApp(appName);
        await gitInit();
        await addConfigFiles();
        await addReadMeFile();
        await addGitIgnoreFile();
        await createDirectory("public");
        await addPublicFiles();
        await createDirectory("src");
        await addSrcFiles();
        log("react-simple-boilerplate created... Enjoy!!!")
    } catch (exception) {
        log(exception);
    }
}

const createDirectory = (name) => {
    return new Promise(resolve => {
        if (name) {
            shell.exec(`mkdir ${name}`, () => {
                log("Directory created");
                resolve(true);
            });
        } else {
            log("\nNo app name was provided.".red);
            log("\nProvide an app name in the following format: ");
            log("\ninit-react-app ", "app-name\n".cyan);
            resolve(false);
        }
    });
}

const cdIntoNewApp = (appName) => {
    return new Promise(resolve => {
        shell.cd(appName);
        resolve();
    });
}

const gitInit = () => {
    return new Promise(resolve => {
        shell.exec(`git init`, () => {
            log("git initialized");
            resolve();
        });
    });
}

const addFiles = (directory, templates) => {
    return new Promise(resolve => {
        log("started copying files...");
        let promises = [];
        Object.keys(templates).forEach((fileName, i) => {
            promises[i] = new Promise(resolve => {
                fs.writeFile(`${directory}/${fileName}`, templates[fileName], (err) => {
                    if (err) {
                        return log(err);
                    }
                    resolve();
                });
            });
        });
        Promise.all(promises).then(() => { resolve() })
        log("copied files...");
    })
};

const addConfigFiles = () => {
    log("adding config files...");
    return addFiles(appDirectory, configTemplates);
};

const writeFile = (fileName, contents) => {
    return new Promise(resolve => fs.writeFile(fileName, contents, function (err) {
        if (err) throw err;
        log(fileName, 'Added!');
        resolve();
    }));
};

const addReadMeFile = () => {
    log("Adding Readme file...");
    return writeFile("readme.md", "This is simple boilerplate than Create react app")
};

const addGitIgnoreFile = () => {
    log("Adding gitignore file");
    return writeFile(".gitignore", "node_modules/ \n dist/");
};

const addPublicFiles = () => {
    log("adding config files...");
    return addFiles(`${appDirectory}/public`, publicTemplates);
};

const addSrcFiles = () => {
    log("adding source files...");
    return addFiles(`${appDirectory}/src`, srcTemplates);
};

const log = (...msg) => {
    console.log(...msg);
}

run();