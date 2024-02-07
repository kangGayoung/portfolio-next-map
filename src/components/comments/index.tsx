import { useSession } from "next-auth/react";
import CommentForm from "@/components/comments/CommentForm";
import { useQuery } from "react-query";
import axios from "axios";
import { CommentApiResponse } from "@/interface";
import CommentList from "@/components/comments/CommentList";
import Pagination from "@/components/Pagination";

interface CommentProps {
    storeId: number;
    page: string;
}

export default function Comments({ storeId, page = "1" }: CommentProps) {
    const { status } = useSession();

    const fetchComments = async () => {
        const { data } = await axios(
            `/api/comments?storeId=${storeId}&limit=5&page=${page}`,
        );

        return data as CommentApiResponse;
    };

    //refetch 댓글 등록 후 댓글 바로 업데이트
    const { data: comments, refetch } = useQuery(
        //-${page} :코멘트 페이지 변경될 때마다 캐싱처리
        `comments-${storeId}-${page}`,
        fetchComments,
    );

    return (
        <div className="md:max-w-2xl py-8 px-2 mb-20 mx-auto">
            {/* comment form */}
            {status === "authenticated" && (
                <CommentForm storeId={storeId} refetch={refetch} />
            )}
            {/* comment list */}
            <CommentList comments={comments} />
            {/* pagination */}

            <Pagination
                total={comments?.totalPage}
                page={page}
                pathname={`/stores/${storeId}`}
            />
        </div>
    );
}
