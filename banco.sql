-- se adptar ao pg

create table usuario (
    id serial primary key,
    email varchar(255) not null,
    nome varchar(255) not null,
    senha varchar(255) not null,
    nascimento date not null
);

create table grupo (
    id serial primary key,
    nome varchar(100) not null,
    adm int not null,
    foreign key(adm) REFERENCES usuario(id)
);

create table grupo_usuario (
    usuario int not null,
    grupo int not null,
    tipo varchar(20) not null,
    foreign key(usuario) REFERENCES usuario(id),
    foreign key(grupo) REFERENCES grupo(id),
    primary key(usuario, grupo)
);

create table mensagem (
    id serial primary key,
    usuario int not null,
    dataEnvio timestamp not null,
    grupo int not null,
    texto varchar(255) not null,
    foreign key(usuario) REFERENCES usuario(id),
    foreign key(grupo) REFERENCES grupo(id)
);

insert into usuario (email, nome, senha, nascimento) values 
('joao@joao.com', 'joao', '1234', '2001-06-11'),
('fernanda@fernanda.com', 'fernanda', '1234', '2000-10-19'),
('julia@julia.com', 'julia', '1234', '2003-01-08'),
('pedro@pedro.com', 'pedro', '1234', '2004-04-14'),
('leila@leila.com', 'leila', '1234', '2002-11-27');

select * from usuario;

insert into grupo (nome, adm) values
('futebol raiz', 1),
('amantes do bbb', 3),
('grupo de informatica', 4);

insert into grupo_usuario (usuario, grupo, tipo) values 
(1, 1, 'admin'),
(2, 1, 'leitor'),
(5, 1, 'escritor'),
(3, 2, 'admin'),
(4, 3, 'admin'),
(2, 3, 'escritor');

insert into mensagem (usuario, dataEnvio, texto, grupo) values
(1, '2022-04-13 19:32:45', 'Sejam Bem vindos', 1),
(3, '2022-04-14 09:22:15', 'Grupo foi criado agora', 2),
(2, '2022-04-15 11:24:10', 'Obrigado por me adicionar no grupo', 3);
