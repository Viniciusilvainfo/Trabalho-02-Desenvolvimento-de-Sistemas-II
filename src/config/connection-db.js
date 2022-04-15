const { Client } = require('pg');

const dbcon = new Client({
    connectionString: 'postgres://nxptesdmmbzgcg:c5eb2693d3036ceadbe721971ec7b0637b23e98dbb731f86197050ac1c0bf628@ec2-52-203-118-49.compute-1.amazonaws.com:5432/d68dpmuvgb8908',
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