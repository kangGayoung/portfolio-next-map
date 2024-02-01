import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import { PrismaClient } from "@prisma/client";

interface Responsetype {
    page?: string;
    limit?: string;
    q?: string;
    district?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType>,
) {
    const { page = "", limit = "", q, district }: Responsetype = req.query;
    const prisma = new PrismaClient();

    if (page) {
        const count = await prisma.store.count(); //페이지 만들어줄 카운트
        const skipPage = parseInt(page) - 1;
        const stores = await prisma.store.findMany({
            // findMany 모든 레코드 가져오기
            orderBy: { id: "asc" },
            // store 리스트에서 검색된 검색어 가져오기
            where: {
                name: q ? { contains: q } : {},
                address: district ? { contains: district } : {},
            },
            take: parseInt(limit),
            skip: skipPage * 10, //쿼리에 맞게 다르게 스킵 페이지를 가져옴
        });

        // totalpage, data, page 객체 넘겨주기

        res.status(200).json({
            page: parseInt(page),
            data: stores,
            totalCount: count,
            totalPage: Math.ceil(count / 10),
        });
        // 200 성공
    } else {
        const { id }: { id?: string } = req.query;
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            where: {
                id: id ? parseInt(id) : {},
            },
        });

        return res.status(200).json(id ? stores[0] : stores);
    }
}
// const stores = (await import('../../data/store_data.json'))[
//     'DATA'
// ] as StoreType[];
