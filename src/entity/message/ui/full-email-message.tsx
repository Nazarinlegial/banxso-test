import {IMailResponseObject} from "@/entity/message/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shared/ui/components/ui/dialog";
import React from "react";
import parse from "html-react-parser";

type IFullMailProps = {
    message: IMailResponseObject,
    onClick?: () => void,
    children: React.ReactNode
}



export default function FullEmailMessage({message, onClick, children}:IFullMailProps) {
    return (
        <Dialog>
            {children}
            <DialogContent className={`overflow-y-auto max-w-[1320px] w-full`}>
                <DialogHeader className={`max-w-[1200px overflow-y-auto w-full`}>
                    <DialogTitle className={`text-base mb-[20px]`}><b>Тема:</b> {message.subject}</DialogTitle>
                    <DialogTitle className={`text-base mb-[20px]`}><b>Відправник:</b> {message.sender.emailAddress.address}</DialogTitle>
                    <DialogDescription className={`max-w-[1400px] w-full overflow-scroll p-4`}>
                        <div className="" dangerouslySetInnerHTML={{__html: message.body.content}} ></div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )

}