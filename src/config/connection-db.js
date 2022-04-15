const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://suyanloriewldo:df2cba65014f84a238dcca8cf78df3f7006319fc4eddef7a0b76997c8be67350@ec2-3-217-251-77.compute-1.amazonaws.com:5432/d19id9d1a5kfad',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("ERRO!!! NAO FOI POSSIVEL CONECTAR NO BANCO");
        console.log( { err });
    } else {
        console.log("BANCO CONECTADO COM SUCESSO");
    }
});

module.exports = {
    dbcon
}