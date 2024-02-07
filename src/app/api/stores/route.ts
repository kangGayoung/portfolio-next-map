import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import prisma from "@/db";
import axios from "axios";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") as string;
    const limit = searchParams.get("limit") as string;
    const q = searchParams.get("q") as string;
    const district = searchParams.get("district") as string;
    const id = searchParams.get("id") as string;

    const session = await getServerSession(authOptions);

    if (page) {
        // get 요청처리
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

        return NextResponse.json(
            {
                page: parseInt(page),
                data: stores,
                totalCount: count,
                totalPage: Math.ceil(count / 10),
            },
            {
                status: 200,
            },
        );
        // 200 성공
    } else {
        // 가게 상세페이지 데이터
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

        return NextResponse.json(id ? stores[0] : stores, {
            status: 200,
        });
    }
}

export async function POST(req: Request) {
    // 데이터 생성을 처리한다
    const formData = await req.json();
    const headers = {
        Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
    };

    // 카카오에서 주소 검색 가져오기
    const { data } = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(formData.address)}`,
        { headers }, //axios 요청시 헤더값 추가 요청
    );

    //위도 경도 값 넣어주기
    const result = await prisma.store.create({
        data: {
            ...formData,
            lat: data.documents[0].y,
            lng: data.documents[0].x,
        },
    });

    return NextResponse.json(result, { status: 200 });
}

export async function PUT(req: Request) {
    // PUT 데이터 수정을 처리
    const formData = await req.json();
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

    return NextResponse.json(result, { status: 200 });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // prisma delete
    if (id) {
        const result = await prisma.store.delete({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(null, { status: 500 });
}
