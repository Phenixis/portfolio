"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/auth/actions"
import { useActionState, useState, useRef, useEffect } from "react"
import type { ActionState } from "@/middleware"
import { Loader } from "lucide-react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function SignUp() {
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const [state, formAction, pending] = useActionState<ActionState, FormData>(signUp, { error: "" })
    const [formFilled, setFormFilled] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        if (state?.success) {
            setShowDialog(true)
        }
    }, [state])

    const verifyFormFilled = () => {
        const isFormFilled = Boolean(
            firstNameRef.current?.value &&
            lastNameRef.current?.value &&
            emailRef.current?.value
        )
        setFormFilled(isFormFilled)
    }

    const verifyEmail = () => {
        const email = emailRef.current?.value || ""
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    return (
        <form
            action={formAction}
            className="w-full min-h-screen flex flex-col space-y-4 items-center justify-center"
        >
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                    <div className="flex space-x-4">
                        <div>
                            <Label required>First Name</Label>
                            <Input
                                type="text"
                                name="first_name"
                                className="text-center"
                                ref={firstNameRef}
                                onChange={verifyFormFilled}
                            />
                        </div>
                        <div>
                            <Label required>Last Name</Label>
                            <Input
                                type="text"
                                name="last_name"
                                className="text-center"
                                ref={lastNameRef}
                                onChange={verifyFormFilled}
                            />
                        </div>
                    </div>
                    <Label required>Email</Label>
                    <Input
                        type="text"
                        name="email"
                        className="text-center"
                        ref={emailRef}
                        onChange={() => {
                            if (verifyEmail()) {
                                verifyFormFilled()
                            }
                        }}
                    />
                </CardContent>
                <CardFooter className={`${pending ? "flex justify-between" : "flex justify-end"}`}>
                    {
                        pending ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            state?.error && <p className="text-red-500">{state.error}</p>
                        )
                    }
                    <Button
                        type="submit"
                        disabled={pending || !formFilled}
                    >Request an account</Button>
                </CardFooter>
            </Card>
            <Link href="/login" className="text-sm text-gray-300 lg:text-gray-500 lg:hover:text-gray-300 underline lg:no-underline lg:hover:underline">Already have an account?</Link>

            {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Account created</DialogTitle>
                        </DialogHeader>
                        <p>Your account has been created !</p>
                        <DialogDescription>
                            You should have received an email with your credentials. These credentials are unique and this is the only time you will see them, please save them in a secure location.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => redirect("/login")}>Login</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </form>
    )
}

