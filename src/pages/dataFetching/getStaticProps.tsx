// 빌드 시점에만 데이터가 생성 > 빌드 후 페칭된 값이 동일하게 보여짐
// Etag : 서버와 클라이언트 간 리소스 변경을 확인
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

export default function Page({
                                 number,
                             }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div>
            <h1>GetStaticProps</h1>
            <h2>number: {number}</h2>
        </div>
    )
}

export const getStaticProps = (async () => {

    // https://www.random.org/clients/http/api/ 랜덤 숫자 가져오는 API
    const num = await fetch(
        'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain')
    const number = await num.json()
    return { props: { number } }
}) satisfies GetStaticProps<{
    number:number;
}>


