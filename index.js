const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// empty array to hold employee objects
const teamMembers = [];

const managerQuestions = [
    "What's Manager's name?",
    "Now please provide the Manager's ID",
    "What is the Manager's email address?",
    "And what is their office number?"
];

const engineerQuestions = [
    "Enter Engineer's name: ",
    "Now please provide Engineer's ID: ",
    "Now Enter Engineer's GitHub username:",
    "What is the Engineer's email address?",
];

const internQuestions = [
    "Okay! What's the Intern's name?",
    "Next up, enter the Intern's ID.",
    "Finally, what's the Intern's email address?",
    "Alright, now give me the Intern's school."
];

//function to write file

function writeToFile(data){
    fs.writeFile(outputPath, data, (err) => {
        if (err) 
            console.log(err);
        else{
            console.log("Your Team Profile has been successfully created!");
        }
    });
}

function generateQuestions (questions) {
    return [
        {
            type: 'input',
            message: questions[0],
            name: 'name',
        },
        {
            type:'input',
            message: questions[1],
            name: 'id',
        },
        {
            type:'input',
            message: questions[2],
            name: 'email',
        },
        {
            type:'input',
            message: questions[3],
            name: 'extra',
        },

    ]
}

function giveChoices(){
    inquirer.prompt([
        {
            type:"list",
            message: "Choose an option to continue",
            name: 'choice',
            choices: [
                "Add an Engineer",
                "Add an Intern",
                "I'm done adding team members"
            ]
        }
    ]).then(answer => followingStep(answer.choice));
}
function followingStep(choice) {
    switch (choice){
        case "Add an Engineer":
            inquirer.prompt(generateQuestions(engineerQuestions)).then(answers =>{
                teamMembers.push(new Engineer(answers.name, answers.id, answers.email, answers.extra));
                giveChoices();
            });
            break;
            
        case "Add an Intern":
            inquirer.prompt(generateQuestions(internQuestions)).then(answers =>{
                teamMembers.push(new Intern(answers.name, answers.id, answers.extra));
                giveChoices();
            });
            break;
        case "I'm done adding team members":
            console.log("Finalize building the team");
            writeToFile(render(teamMembers));
    }
}

function startApp() {

    inquirer.prompt(generateQuestions(managerQuestions)).then(answers => {
        teamMembers.push (new Manager(answers.name, answers.id, answers.email, answers.extra));
        giveChoices();
    });

}

startApp();