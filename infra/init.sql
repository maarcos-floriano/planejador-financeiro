CREATE DATABASE IF NOT EXISTS planilha_sptech;

USE planilha_sptech;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ra BIGINT NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE registro_financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fkUser INT NOT NULL,
    FOREIGN KEY (fkUser) REFERENCES usuario(id)
);
