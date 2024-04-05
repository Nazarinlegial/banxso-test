import Header from "@/widgets/header/header";


export default function BaseLayout({children}: { children: React.ReactNode }) {


    return (
        <>
            <Header/>
            {children}
        </>
    )
}