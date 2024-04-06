
import {IMailResponseObject} from "@/entity/message/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/components/ui/dialog";
import React, {FC, useEffect, useRef} from "react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import "dayjs/locale/uk"
import dayjs from "dayjs";

type IFullMailProps = {
    message: IMailResponseObject,
    onClick?: () => void,
    children: React.ReactNode
}

import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)


const IFrameMessage: FC<{ message: string }> = ({message}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    useEffect(() => {
        console.log('iframeRef', iframeRef)
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.document.open();
            iframeRef.current.contentWindow.document.write(message);
            iframeRef.current.contentWindow.document.close();
        }
    }, [message]);

    return (
        <iframe className={`bg-white w-full h-[350px] sm:h-[400px] lg:h-490px 2xl:h-[610px]`} ref={iframeRef}/>
    )
}

export default function FullEmailMessage({message, onClick, children}: IFullMailProps) {
    return (
        <Dialog>
            {children}
            <DialogContent className={`max-w-[520px] text-left md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1080px] 2xl:max-w-[1320px] w-full`}>
                <DialogHeader className={`w-full text-left` }>
                    <DialogTitle className={`text-base mb-[20px]`}><b
                        className={`text-sm`}>Тема:</b> {message.subject}</DialogTitle>
                    <h3 className={`text-base mb-[20px!important] `}><b
                        className={`text-sm`}>Відправник:</b> {message.sender.emailAddress.address}</h3>
                    <h3 className={`text-base `}>
                        <b className={`text-sm`}>Час:</b> {dayjs(message.createdDateTime).locale('uk').format('L llll')}</h3>
                </DialogHeader>
                <DialogBody>
                    <section className={`w-full max-h-[calc(90vh-104px)]`}>
                        {/*<div className="" dangerouslySetInnerHTML={{__html: message.body.content}} ></div>*/}
                        {/*{parse(message.body.content)}*/}
                        {message.body.contentType === "html"
                            ? <IFrameMessage message={message.body.content}/>
                            : message.body.content
                        }
                    </section>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )

}