import type { NextApiRequest, NextApiResponse } from "next";
import { StoreType } from "@/interface";
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreType[]>,
) {
    const prisma = new PrismaClient();
    const stores = await prisma.store.findMany(); // findMany 모든 레코드 가져오기

    // const stores = (await import('../../data/store_data.json'))[
    //     'DATA'
    // ] as StoreType[];

    res.status(200).json(stores);
    // 200 성공
}
