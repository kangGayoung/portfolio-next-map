import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import prisma from "@/db";

// const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt" as const, // jwt 기반의 세션을 사용한다
        maxAge: 60 * 60 * 24, // 최대 수명 설정, 초단위로 표시
        updateAge: 60 * 60 * 2, //세션 업데이트 주기
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID || "",
            clientSecret: process.env.NAVER_CLIENT_SECRET || "",
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID || "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/users/login", //로그인 콜백
    },
};

export default NextAuth(authOptions);
