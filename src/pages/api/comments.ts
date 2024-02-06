import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/db";
import { CommentInterface, CommentApiResponse } from "@/interface";

interface ResponseType {
    id?: string;
    page?: string;
    limit?: string;
    storeId?: string;
    user?: boolean;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CommentInterface | CommentApiResponse>,
) {
    const session = await getServerSession(req, res, authOptions);
    const {
        id = "",
        page = "1",
        limit = "10",
        storeId = "",
        user = false,
    }: ResponseType = req.query;

    if (req.method === "POST") {
        // 댓글 생성 로직
        if (!session?.user) {
            return res.status(401);
        }

        const { storeId, body }: { storeId: number; body: string } = req.body;
        const comment = await prisma.comment.create({
            data: {
                storeId,
                body,
                userId: session.user.id,
            },
        });

        return res.status(200).json(comment);
    } else if (req.method === "DELETE") {
        // 댓글 삭제 로직
        if (!session?.user || !id) {
            // 세션 로그인이 안됬거나 아이디 없을때
            return res.status(401);
        }

        const result = await prisma.comment.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(200).json(result);
    } else {
        // 댓글 가져오기 -> 댓글 리스트 만들기
        const skipPage = parseInt(page) - 1;
        const count = await prisma.comment.count({
            // 모든 댓글 가져오기
            where: {
                storeId: storeId ? parseInt(storeId) : {},

                //user 댓글만 가져오기
                userId: user ? session?.user.id : {},
            },
        });

        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                storeId: storeId ? parseInt(storeId) : {},
                //user 댓글만 가져오기
                userId: user ? session?.user.id : {},
            },
            skip: skipPage * parseInt(limit),
            take: parseInt(limit),
            include: {
                // 댓글에 유저 내용
                user: true,
                store: true, //가게정보
            },
        });

        return res.status(200).json({
            data: comments,
            page: parseInt(page),
            totalPage: Math.ceil(count / parseInt(limit)),
        });
    }
}
