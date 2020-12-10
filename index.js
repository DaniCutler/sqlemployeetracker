
// aquire all modules
const util = require("util");
const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");
const { defaultCipherList } = require("constants");
// create connection
const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "employees"
});
connection.connect(function (err){
    if (err){
        console.error("error connecting:" + err.stack);
        return;
    }
});

// getting role and adding,viewing, updating or deleting... prompts user
getJob();

function getJob() {
    inquirer.prompt({

            name: 'job',
            type: 'list',
            message:'What would you like to do?',
            choices: ['add', 'view', 'update', 'delete', 'exit'],


        }
    ).then(function({job}){
        switch (job){
            case 'add':
                add();
                break;
            case 'view':
                viewList();
                break;
            case 'update':
                update();
                break;
            case 'delete':
                deleteList();
                break;
            case 'exit':
                connection.end()
                return;
            
            
        }
    })
}

// adding a department, role or employee... prompts user
function add() {
    inquirer.prompt({
        
            name: "db",
            type: 'list',
            message:'What would you like to add?',
            choices: ['department', 'role', 'employee'],


        }
    ).then(function({db}){
        switch (db){
            case "department":
                add_department()
                break;
            case "role":
                add_role()
                break;
            case 'employee':
                add_employee();
                break;
            
            
        }
    })
}

// adding department.... prompts user
function add_department() {
    inquirer
        .prompt(
            {
                name: 'name',
                message: "What would you like to name the department?",
                type: 'input'
            }
        ).then(function ({ name }) {
            connection.query(`INSERT INTO department (name) VALUES ('${name}')`, function (err, data) {
                if (err) throw err;
                console.log(`Added`)
                getJob();
            })
        })
}

// adding a role, salary and department id... prompts user
function add_role() {
    let departments = []

    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) throw err;

        for (let i = 0; i < data.length; i++) {
            departments.push(data[i].name)
        }

        inquirer
            .prompt([
                {
                    name: 'title',
                    message: "What is the name of the role?",
                    type: 'input'
                },
                {
                    name: 'salary',
                    message: 'How much is their salary?',
                    type: 'input'
                },
                {
                    name: 'department_id',
                    message: 'What department do they belong in?',
                    type: 'list',
                    choices: departments
                }
            ]).then(function ({ title, salary, department_id }) {
                let index = departments.indexOf(department_id)

                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${index})`, function (err, data) {
                    if (err) throw err;
                    console.log(`Added`)
                    getJob();
                })
            })
    })
}

// adding an employee what is their id and who is their manager... prompts user
function add_employee() {
    let employees = [];
    let roles = [];

    connection.query(`SELECT * FROM role`, function (err, data) {
        if (err) throw err;

        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        }

        connection.query(`SELECT * FROM employee`, function (err, data) {
            if (err) throw err;

            for (let i = 0; i < data.length; i++) {
                employees.push(data[i].first_name);
            }

            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        message: "What is the employee's first name?",
                        type: 'input'
                    },
                    {
                        name: 'last_name',
                        message: 'What is their last name?',
                        type: 'input',
                    },
                    {
                        name: 'role_id',
                        message: 'What is their role?',
                        type: 'list',
                        choices: roles,
                    },
                    {
                        name: 'manager_id',
                        message: "Who is their manager?",
                        type: 'list',
                        choices: ['none'].concat(employees)
                    }

                ]).then(function ({ first_name, last_name, role_id, manager_id }) {
                    let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
                    if (manager_id != 'none') {
                        queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id)}, ${employees.indexOf(manager_id) + 1})`
                    } else {
                        queryText += `) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id) + 1})`
                    }
                    console.log(queryText)

                    connection.query(queryText, function (err, data) {
                        if (err) throw err;

                        getJob();
                    })
                })
        })
    })
}
