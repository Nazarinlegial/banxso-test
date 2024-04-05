'use client'
import React, {FC, useState} from "react";
import {WithProtectedPage} from "@/features/authentication/protected-page";
import {ROLES} from "@/entity/user/model/user";
import {AccessTokenListener} from "@/features/authentication/accesstoken-listener";
import BaseLayout from "@/widgets/layout/base";
import {useMessages} from "@/entity/message/api/messages";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/components/ui/table"
import {Skeleton} from "@/shared/ui/components/ui/skeleton";
import {CheckIcon, LockIcon} from "lucide-react";
import dayjs from "dayjs";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/shared/ui/components/ui/pagination";
import {FullEmailMessage} from "@/entity/message";
import {DialogTrigger} from "@/shared/ui/components/ui/dialog";


type DashboardProps = {
    params?: any
}

function Dashboard({params}: DashboardProps) {
    const [mailsQuery, setMailQuery] = useState({
        page: 1,
        take: 10
    })
    const {isSuccess, data, isLoading} = useMessages(mailsQuery)

    const handlePage = (page: number) => setMailQuery(prevState => {
        return {
            ...prevState,
            page
        }
    })

    const iterationHandlePage = (type: 'next' | 'prev', count: number) => setMailQuery(prevState => {
        let page = 1
        if (type === "next") page = mailsQuery.page < count ? mailsQuery.page + 1 : mailsQuery.page
        if (type === "prev") page = mailsQuery.page > 1 ? mailsQuery.page - 1 : mailsQuery.page

        return {
            ...prevState,
            page
        }
    })

    return (
        <>
            <AccessTokenListener/>
            <WithProtectedPage role={[ROLES.user, ROLES.admin]}>
                <BaseLayout>
                    <section className={`dashboard pt-[60px] md:pt-[120px] pb-[30px] md:pb-[60px]`}>
                        <div className="container mx-auto">
                            {
                                isLoading
                                    ? (
                                        <div
                                            className="pt-5 mx-auto flex w-full justify-center flex-col space-y-3">
                                            <Skeleton
                                                className="h-[125px] sm:w-full md:max-w-[1400px] w-[250px] rounded-xl"/>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 sm:w-full md:max-w-[1400px] w-[250px]"/>
                                                <Skeleton className="h-4 sm:w-full md:max-w-[1400px] w-[250px]"/>
                                            </div>
                                        </div>
                                    ) : isSuccess && data ? (
                                        <>
                                            <Table className={`mb-10`}>
                                                <TableCaption>Список ваши останіх повідомлень</TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Дата</TableHead>
                                                        <TableHead>Відправник</TableHead>
                                                        <TableHead>Тема</TableHead>
                                                        <TableHead align={`center`}
                                                                   className={`text-center`}>Прочитано</TableHead>
                                                        <TableHead align={"right"}
                                                                   className={`text-center`}>Переглянути</TableHead>

                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.messages.map((mail, i) => {
                                                        return (
                                                            <React.Fragment key={`${mail.conversationId}-${i}`}>
                                                                <FullEmailMessage message={mail}>
                                                                    <>
                                                                        <TableRow>
                                                                            <TableCell
                                                                                className="font-light">{dayjs(mail.createdDateTime).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                                            <TableCell>{mail.sender.emailAddress.address}</TableCell>
                                                                            <TableCell>{mail.subject}</TableCell>
                                                                            <TableCell align={`center`}>
                                                                                {mail.isRead
                                                                                    ? <CheckIcon className={`w-4 h-4`}/>
                                                                                    : <LockIcon className={`w-4 h-4`}/>}
                                                                            </TableCell>
                                                                            <TableCell align={`center`}>
                                                                                    <DialogTrigger >
                                                                                        Детальніше
                                                                                    </DialogTrigger>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </>
                                                                </FullEmailMessage>
                                                            </React.Fragment>
                                                        );
                                                    })}

                                                </TableBody>
                                            </Table>
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            onClick={() => iterationHandlePage('prev', data.countPage)}
                                                            href="#prev"/>
                                                    </PaginationItem>
                                                    {
                                                        Array.from({length: data.countPage}, (_, i) => i + 1).map((page, i) => {
                                                            return (
                                                                <PaginationItem key={page + i}>
                                                                    <PaginationLink isActive={page === mailsQuery.page}
                                                                                    onClick={() => handlePage(page)}
                                                                                    href={`#page=${page}`}>{page}</PaginationLink>
                                                                </PaginationItem>
                                                            )
                                                        })
                                                    }
                                                    <PaginationItem>
                                                        <PaginationEllipsis/>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationNext
                                                            onClick={() => iterationHandlePage('next', data.countPage)}
                                                            href="#next"/>
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination></>

                                    ) : ''
                            }
                        </div>
                    </section>
                </BaseLayout>
            </WithProtectedPage>
        </>
    )
}


export default Dashboard