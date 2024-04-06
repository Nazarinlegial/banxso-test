'use client'
import React, {FC, useEffect, useState} from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/shared/ui/components/ui/pagination";
import {usePagination} from "@/features/pagination";
import {Input} from "@/shared/ui/components/ui/input";

type PaginationMailProps = {
    count: number,
    onSetPage?: (currentPage: number) => void
}

const getPage = (url: string) => {
    return url.split('#')
}

export const PaginationMail: FC<PaginationMailProps> = ({count, onSetPage}) => {
    const {
        setPage,
        pagination,
        countPages,
    } = usePagination(count)
    const [inputPage, setInputPage] = useState<string>('')


    const iterationHandlerPage = (type: 'next' | 'prev') => {
        let page = 1
        if (type === "next") page = pagination.currentPage < countPages ? pagination.currentPage + 1 : pagination.currentPage
        if (type === "prev") page = pagination.currentPage > 1 ? pagination.currentPage - 1 : pagination.currentPage
        setPage(page)
        if (onSetPage) onSetPage(page)
    }

    const onClickPage = (page: number) => {
        setPage(page)
        if (onSetPage) onSetPage(page)
    }

    useEffect(() => {
        const page = parseInt(inputPage)
        if (page > countPages) return

        const debounce = setTimeout(() => onClickPage(page), 1000)
        return () => clearTimeout(debounce)
    }, [inputPage]);

    const parseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(e.target.value)
        if (number) setInputPage(e.target.value)
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => iterationHandlerPage('prev')}
                        href={'#'}
                    />
                </PaginationItem>
                {
                    pagination.pages.map((page) => {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === pagination.currentPage}
                                    onClick={() => onClickPage(page)}
                                    href={'#'}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })
                }
                <PaginationItem>
                    <PaginationNext
                        onClick={() => iterationHandlerPage('next')}
                        href={'#'}
                    />
                </PaginationItem>
                <Input className={`max-w-[70px]`} title={`Введіть сторінку`} placeholder={'1'} value={inputPage}
                       onChange={parseChange}
                />

            </PaginationContent>
        </Pagination>)

}
