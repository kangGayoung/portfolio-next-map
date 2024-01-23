import {useRouter} from "next/router";

export default function StoreEditPage(){
    // 현재 상태 페이지 확인 -> 특정 맛집의 데이터를 가져올때 필요
    const router = useRouter();
    const {id} = router.query;
    return(
        <div>
            <h1>Store Edit: {id}</h1>
        </div>
    )
}