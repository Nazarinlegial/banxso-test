'use client'
import React, {useState} from "react";
import {Button} from "@/shared/ui/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/components/ui/dialog"
import {Input} from "@/shared/ui/components/ui/input"
import {Textarea} from "@/shared/ui/components/ui/textarea"
import {Label} from "@/shared/ui/components/ui/label";
import {useMutationSendMessage} from "@/entity/message/api/messages";
import {ISendMailRequest} from "@/entity/message/types";
import {useToast} from "@/shared/ui/components/ui/use-toast";
import dayjs from "dayjs";
import {ToastAction} from "@/shared/ui/components/ui/toast";
import {AxiosError} from "axios";


export default function SendMailPopup({children}: { children: React.ReactNode }) {
    const {mutate, isPending} = useMutationSendMessage()
    const {toast} = useToast()
    const [formState, setFormState] = useState<ISendMailRequest>({

        recipient_mail: "",
        subject: "",
        body: ""

    })


    const updateState = (state: Partial<ISendMailRequest>) => {
        setFormState(prevState => ({
            ...prevState,
            ...state
        }))
    }

    const onSubmit = async () => {
        try {
            mutate(formState, {
                onSuccess: (data: { message: string }) => {
                    toast({
                        title: dayjs().format('ddd HH:mm'),
                        description: data.message,
                        action: (
                            <ToastAction altText="Зрозуміло">Зрозуміло</ToastAction>
                        ),
                    })
                    setFormState({
                        recipient_mail: "",
                        body: "",
                        subject: ""
                    } as ISendMailRequest)
                },
                onError: (e) => {
                    if(e instanceof AxiosError) {
                        const messageErrors = e!.response!.data?.errors.details
                        messageErrors.forEach((item:any, i: number) => {
                            console.log()
                            toast({
                                title: dayjs().format('ddd HH:mm'),
                                className: 'mb-3',
                                key: i * Date.now(),
                                description: item.message,
                                variant: "destructive",
                                action: (
                                    <ToastAction altText={item.message + i}>Зрозуміло</ToastAction>
                                ),
                            })
                        })
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Надіслати Email</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" placeholder={`banxso@media.test`} value={formState.recipient_mail}
                               onChange={(e) => updateState({recipient_mail: e.target.value})} className="col-span-3"/>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Тема<sub>*</sub>
                        </Label>
                        <Input id="subject" placeholder={`Тема`} value={formState.subject} className="col-span-3"
                               onChange={(e) => updateState({subject: e.target.value})}/>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="body" className="text-right">
                            Лист
                        </Label>
                        <Textarea id={`body`} placeholder={`Текст...`} value={formState.body} className={`col-span-3 min-h-[300px]`}
                                  onChange={(e) => updateState({body: e.target.value})}>
                        </Textarea>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isPending} onClick={onSubmit} type="submit">Відправити</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}