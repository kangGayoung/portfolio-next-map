import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import prisma from "@/db";
import axios from "axios";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface Responsetype {
    page?: string;
    limit?: string;
    q?: string;
    district?: string;
    id?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null>,
) {
    const { page = "", limit = "", q, district, id }: Responsetype = req.query;
    //const prisma = new PrismaClient();
    const session = await getServerSession(req, res, authOptions);

    if (req.method === "POST") {
        // 데이터 생성을 처리한다
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };

        // 카카오에서 주소 검색 가져오기
        const { data } = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`,
            { headers }, //axios 요청시 헤더값 추가 요청
        );

        //console.log("@@data", data, data.documents[0].y, data.documents[0].x);

        //위도 경도 값 넣어주기
        const result = await prisma.store.create({
            data: {
                ...formData,
                lat: data.documents[0].y,
                lng: data.documents[0].x,
            },
        });

        return res.status(200).json(result);
    } else if (req.method === "PUT") {
        // PUT 데이터 수정을 처리
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };

        // 카카오에서 주소 검색 가져오기
        const { data } = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`,
            { headers }, //axios 요청시 헤더값 추가 요청
        );
        // prisma update
        const result = await prisma.store.update({
            where: { id: formData.id },
            data: {
                ...formData,
                lat: data.documents[0].y,
                lng: data.documents[0].x,
            },
        });

        return res.status(200).json(result);
    } else if (req.method === "DELETE") {
        // prisma delete
        if (id) {
            const result = await prisma.store.delete({
                where: {
                    id: parseInt(id),
                },
            });

            return res.status(200).json(result);
        }
        return res.status(500).json(null);
    } else {
        if (page) {
            const count = await prisma.store.count(); //페이지 만들어줄 카운트
            const skipPage = parseInt(page) - 1; // 페이지는 0에서 시작
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
            // 가게 상세페이지 데이터
            const { id }: { id?: string } = req.query;
            const stores = await prisma.store.findMany({
                orderBy: { id: "asc" },
                where: {
                    id: id ? parseInt(id) : {},
                },
                include: {
                    likes: {
                        where: session ? { userId: session.user.id } : {},
                    },
                },
            });

            return res.status(200).json(id ? stores[0] : stores);
        }
    }
}
// const stores = (await import('../../data/store_data.json'))[
//     'DATA'
// ] as StoreType[];
