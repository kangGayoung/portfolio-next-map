// 요청마다 데이터가 프리랜더링 되어서 보여짐
// Etag : 서버와 클라이언트 간 리소스 변경을 확인
//https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export const getServerSideProps = (async () => {
    // Fetch data from external API
    const num = await fetch('https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain')
    const number: number = await num.json()
    // Pass data to the page via props
    return { props: { number } }
}) satisfies GetServerSideProps<{ number:number; }>

export default function Page({
                                 number,
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <h1>getServerSideProps</h1>
            <h2>Number: {number}</h2>
        </div>
    )
}