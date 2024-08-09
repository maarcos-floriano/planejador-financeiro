CREATE DATABASE IF NOT EXISTS planilha_sptech;

USE planilha_sptech;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ra BIGINT NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE registro_financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    fkUser INT NOT NULL,
    FOREIGN KEY (fkUser) REFERENCES usuarios(id)
);
