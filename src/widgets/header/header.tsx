'use client'
import {useAppContext} from "@/_app/providers";
import {Avatar, AvatarFallback} from "@/shared/ui/components/ui/avatar";
import {nameLetters} from "@/shared/utils";
import {Button} from "@/shared/ui/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/ui/components/ui/sheet"
import {LogOutIcon, MailIcon, MenuIcon} from "lucide-react";
import {Badge} from "@/shared/ui/components/ui/badge";
import {ROLES, ROLES_NAME} from "@/entity/user/model/user";
import {useLogout} from "@/features/authentication/logout/hook/useLogout";
import SendMailPopup from "@/features/send-mail/ui/send-mail-popup";


export default function Header() {
    const {user} = useAppContext()
    const {profile, role, user_id} = user
    const logout = useLogout()


    return (
        <>
            <Sheet>
                <header className={`py-2 px-8 sm:px-12 bg-slate-900 w-full`}>
                    <div className="flex flex-wrap gap-5 w-full items-center justify-between">
                        <div className="flex gap-3 items-center justify-start">
                            <Avatar>
                                <AvatarFallback>
                                    {nameLetters(profile.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            {
                                role === ROLES.user
                                    ? <Badge className={`h-7 px-4`} variant="outline">{ROLES_NAME[role]}</Badge>
                                    : <Badge variant="destructive">{ROLES_NAME[role]}</Badge>
                            }
                            {
                                role === ROLES.admin
                                && (
                                    <SendMailPopup>
                                        <Button variant={`destructive`}>Надіслати Email</Button>
                                    </SendMailPopup>
                                )

                            }


                        </div>
                        <SheetTrigger>
                            <MenuIcon className={`w-4 h-4`}/>
                        </SheetTrigger>
                    </div>
                </header>
                <SheetContent>
                    <SheetHeader>
                        <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between pt-[20px]">
                            <div className="flex flex-col gap-[16px]">
                                <SheetTitle>
                                    ID: {user_id}
                                </SheetTitle>
                                <div className="text-lg font-semibold text-zinc-50">
                                    {profile.displayName}
                                </div>
                                <div className="text-sm font-medium text-zinc-300 flex gap-4 items-center">
                                    <MailIcon className={`w-4 h-4`}/> {profile.mail}
                                </div>
                                <SheetDescription>
                                    {profile.jobTitle}
                                </SheetDescription>
                            </div>
                            <Button variant={`secondary`} onClick={logout} className={`w-full gap-5 py-6 `}>
                                <LogOutIcon/> Вийти
                            </Button>
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    )
}