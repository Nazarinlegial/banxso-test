import {useEffect, useState} from "react";


type IPaginationState = {
    currentPage: number,
    pages: number[],
}

type IPaginationRes = {
    pagination: IPaginationState,
    setPage: (page:number) => void
}

export function usePagination(count: number, currentPage?: number ) {
    const [pagination, setPagination] = useState<IPaginationState>({
        currentPage: currentPage || 1,
        pages: []
    })
    const left_right = 1
    useEffect(() => {
        const pages = new Set<number>()
        for (let i = Math.max(1, pagination.currentPage - left_right); i <= Math.min(count, pagination.currentPage + left_right ); i++) {
            pages.add(i)
        }
        pages.add(1)
        pages.add(count)
        const sortedPage = Array.from(pages).sort((a,b) => a - b)

        setPagination(prevState => ({...prevState, pages: sortedPage }))

    }, [pagination.currentPage, count])

    const setPage = (page: number)  => {
        setPagination(prevState => ({...prevState, currentPage: page}))
    }

    return  {
        setPage,
        pagination,
        countPages: count
    }
}