const pg = require ('pg');

const client = new pg.Client('postgres://localhost/fullstack_db');


const syncAndSeed = async()=>{
    const SQL = `
    DROP TABLE IF EXISTS employee;
    DROP TABLE IF EXISTS position;
    CREATE TABLE position(
        id INTEGER PRIMARY KEY, 
        position VARCHAR(100) NOT NULL
        );
    CREATE TABLE employee(
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        employee_id INTEGER REFERENCES position(id)
    );
   
    INSERT INTO position (id, position) VALUES (1, 'PROFFESOR');
    INSERT INTO position (id, position) VALUES (2, 'FELLOW');
    
    INSERT INTO employee (id, name, employee_id) VALUES (1, 'PROF', 1);
    INSERT INTO employee (id, name, employee_id) VALUES (2, 'thompson', 2);
    INSERT INTO employee (id, name, employee_id) VALUES (3, 'nick', 2);
    `;

    await client.query(SQL);

}

module.exports = {
    client,
    syncAndSeed
}