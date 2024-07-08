
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    host: 'dpg-cq60ohss1f4s73dqahg0-a.oregon-postgres.render.com',
    user: 'geo12',
    password: 'EiryhjzjWpVRKt3rsUcmPlKQXSobgLzg',
    database: 'control_escolar_3ak3',
    port: 5432,
});

app.post('/profesor/registrar', async (req, res) => {
    const { id, nombre, correo, direccion } = req.body;
    const sql = 'INSERT INTO profesores VALUES($1, $2, $3, $4)';
    try {
        const result = await pool.query(sql, [id, nombre, correo, direccion]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/profesor/modificar/:id', async (req, res) => {
    const identificador = req.params.id;
    const { nombre, correo, direccion } = req.body;
    const sql = 'UPDATE profesores SET nombre=$1, correo=$2, direccion=$3 WHERE id=$4';
    try {
        const result = await pool.query(sql, [nombre, correo, direccion, identificador]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/profesor/eliminar/:id', async (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM profesores WHERE id=$1';
    try {
        const result = await pool.query(sql, [id]);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/', async (req, res) => {
    const sql = 'SELECT * FROM profesores';
    try {
        const result = await pool.query(sql);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/profesor/editar/:id', async (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM profesores WHERE id=$1';
    try {
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Profesor no encontrado');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/profesor/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    const sql = 'SELECT * FROM profesores WHERE nombre LIKE $1';
    try {
        const result = await pool.query(sql, [`%${nombre}%`]);
        res.status(200).send(result.rows);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.all('*', (req, res) => {
    const respuesta = {
        codigo: 300,
        mensaje: 'La ruta no existe',
    };
    res.send(respuesta);
});

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
