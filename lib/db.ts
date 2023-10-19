import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

//!Dara problemas en develpment por el hot reload ya que se crea una nueva instancia de prisma cada vez que se hace un cambio
//export const db = new PrismaClient(); 
