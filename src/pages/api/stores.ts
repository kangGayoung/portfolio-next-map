import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse } from "@/interface";
import { PrismaClient } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse>,
) {
    const { page = "1" }: { page?: string } = req.query;
    const prisma = new PrismaClient();

    const count = await prisma.store.count(); //페이지 만들어줄 카운트
    const skipPage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
        // findMany 모든 레코드 가져오기
        orderBy: { id: "asc" },
        take: 10,
        skip: skipPage * 10, //쿼리에 맞게 다르게 스킵 페이지를 가져옴
    });

    // totalpage, data, page 객체 넘겨주기

    // const stores = (await import('../../data/store_data.json'))[
    //     'DATA'
    // ] as StoreType[];

    res.status(200).json({
        page: parseInt(page),
        data: stores,
        totalCount: count,
        totalPage: Math.ceil(count / 10),
    });
    // 200 성공
}
