import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { StoreType } from "@/interface";

export default function StorePage() {
    const router = useRouter();
    const { id } = router.query;

    const fetchStore = async () => {
        const { data } = await axios(`/api/stores?id=${id}`);
        return data as StoreType;
    };

    const {
        data: store,
        isFetching,
        isError,
    } = useQuery(`store-${id}`, fetchStore, {
        enabled: !!id,
    });

    console.log(store, isFetching, isError);

    return (
        <div>
            <h1>Store Detail: {id}</h1>
        </div>
    );
}
