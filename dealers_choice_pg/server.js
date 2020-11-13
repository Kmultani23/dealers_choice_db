const express = require ('express');
const app = express()
const path = require('path')
const { client, syncAndSeed } = require('./db')


const port = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', async(req, res, next)=>{
    try{
        const data = await client.query(`SELECT * FROM position`);
        const positions = data.rows;
        res.send(`
        <html>
        <head>
        <link rel = 'stylesheet' href= '/assets/style.css' />
        <title> KARANDEEP Hw </title>
        <h1> FULLSTACK </h1>
        <h2> <a href= '/'> EMPLOYEE:  </a></h2>
        </head>
        
        <body>
        
        <ul>
        ${
            positions.map(position => `
            <li>
            <a href = '/position/${position.id}'>
            ${position.position}
            </li>
            `).join('')
        }
        </ul>
        </body>

        </html>
        `)
    }
    catch(ex){
        next(ex)
    }
});

app.get('/position/:id', async(req, res, next)=>{
    try{
        const promises = [
        client.query(`SELECT * FROM position WHERE id=$1;`, [req.params.id]),
        client.query(`SELECT * FROM employee WHERE employee_id=$1;`, [req.params.id])
        ]
        const [thePosition, allemployees] = await Promise.all(promises)
        const position = thePosition.rows[0];
        const employees = allemployees.rows;
        res.send(`
        <html>
        <head>
        <link rel = 'stylesheet' href= '/assets/style.css' />
        <title> KARANDEEP Hw </title>
        <h1> FULLSTACK </h1>
        <h2><a href= '/'> EMPLOYEE: </a></h2>
        <h3>Selected employee is a ${position.position} : </h3>
        </head>
        
        <body>
        <ul> 
        ${
            employees.map(employee => `
            <li>
            ${employee.name}
            </li>
            `).join('')
        }
        
        </ul>
        
        </body>

        </html>
        `);
    }
    catch(ex){
        next(ex)
    }
});


const start = async()=>{
    try{
        await client.connect();
        await syncAndSeed();
        app.listen(port, () =>{
            console.log(`your listening on ${port}`)
        })
        console.log('hello')
    }
    catch(ex){
        console.log(ex)
    }

}
start()
