/*********************************************************************
 * Objetivo: Realizar a interação do usuario com o banco de dados
 * DATA: 22/08/2023
 * Autor: Genivania Macedo
 * Versão: 1.0
 ********************************************************************/

//Import da biblioteca do prisma client(responsável por manipular dados no BD)
var { PrismaClient } = require('@prisma/client')

//Instancia da classe do PrismaClient
var prisma = new PrismaClient();