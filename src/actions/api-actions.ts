"use server";

import { Api } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const getApis = async():Promise<Api[]>=>{
    const apis = await prisma.api.findMany();
    return apis;
}