'use client'
import React, {useState} from "react";
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
import {BookOpenIcon, CheckIcon, LockIcon, MailOpenIcon} from "lucide-react";
import dayjs from "dayjs";
import {FullEmailMessage} from "@/entity/message";
import {DialogTrigger} from "@/shared/ui/components/ui/dialog";
import {PaginationMail, usePagination} from "@/features/pagination";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/components/ui/select";


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
                                            className="pt-5 mb-10 mx-auto flex w-full justify-center flex-col space-y-3">
                                            <Skeleton
                                                className="h-[125px] sm:w-full md:max-w-[1400px] w-[250px] rounded-xl"/>
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 sm:w-full md:max-w-[1400px] w-[250px]"/>
                                                <Skeleton className="h-4 sm:w-full md:max-w-[1400px] w-[250px]"/>
                                            </div>
                                        </div>
                                    ) : isSuccess && data ? (
                                        <>
                                            <div className={`mb-10`}>


                                                <Table className={`mb-10`}>
                                                    <TableCaption>Список ваши останіх повідомлень</TableCaption>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">Дата</TableHead>
                                                            <TableHead>Відправник</TableHead>
                                                            <TableHead className={`hidden md:table-cell `}>Тема</TableHead>
                                                            <TableHead align={`center`} className={`text-center`}>Прочитано</TableHead>
                                                            <TableHead align={"right"} className={`text-center`}>Переглянути</TableHead>

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
                                                                                    className="font-light">{dayjs(mail.createdDateTime).locale('uk').format("YYYY-MM-DD HH:mm")}</TableCell>
                                                                                <TableCell>
                                                                                    <p className={`w-full max-w-[120px] sm:max-w-[210px] truncate md:max-w-none`}>
                                                                                        {mail.sender.emailAddress.address}
                                                                                    </p>
                                                                                    </TableCell>
                                                                                <TableCell
                                                                                    className={`hidden md:table-cell`}>{mail.subject}</TableCell>
                                                                                <TableCell align={`center`}>
                                                                                    {mail.isRead
                                                                                        ? <MailOpenIcon
                                                                                            className={`w-5 h-5 text-teal-500`}/>
                                                                                        : <LockIcon
                                                                                            className={`w-5 h-5 text-red-500`}/>}
                                                                                </TableCell>
                                                                                <TableCell align={`center`}>
                                                                                    <DialogTrigger>
                                                                                        <BookOpenIcon
                                                                                            className={`w-6 h-6`}/>
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
                                            </div>
                                        </>

                                    ) : ''
                            }
                            <Select
                                onValueChange={e => setMailQuery(prevState => ({...prevState, take: parseInt(e)}))}
                                defaultValue={mailsQuery.take.toString()}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Кількість"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="35">35</SelectItem>
                                </SelectContent>
                            </Select>


                            <PaginationMail count={data?.countPage || 1} onSetPage={handlePage}/>


                        </div>
                    </section>
                </BaseLayout>
            </WithProtectedPage>
        </>
    )
}


export default Dashboard