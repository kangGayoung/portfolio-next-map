import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface CommentFormProps {
    storeId: number;
    refetch: () => void;
}

export default function CommentForm({ storeId, refetch }: CommentFormProps) {
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm();
    return (
        <form
            onSubmit={handleSubmit(async (data) => {
                const result = await axios.post("/api/comments", {
                    ...data,
                    storeId,
                });

                //console.log(result);

                if (result.status === 200) {
                    toast.success("댓글을 등록했습니다.");
                    resetField("body"); // 등록내용 지우기
                    refetch?.(); //refetch 댓글 등록 후 댓글 바로 업데이트 // ?. 예외처리 /리페치있는경우만 호출해라
                } else {
                    toast.error("다시 시도해주세요.");
                }
            })}
            className="flex flex-col space-y-2"
        >
            {/* error box */}
            {errors?.body?.type === "required" && (
                <div className="text-xs text-red-600">
                    필수 입력 사항입니다.
                </div>
            )}
            <textarea
                rows={3}
                placeholder="댓글을 작성해주세요."
                {...register("body", { required: true })}
                className="block w-full min-h-[120px] resize-non border rounded-md bg-transparent py-2.5 px-4 text-black placeholder:text-gray-400 text-sm leading-6"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-semibold shadow-sm  mt-2 rounded-md"
            >
                작성하기
            </button>
        </form>
    );
}
