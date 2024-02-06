// next auth 에 추가한 id값 타입 정의

import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            name?: string;
            email: string;
            image?: string;
        };
    }
}
