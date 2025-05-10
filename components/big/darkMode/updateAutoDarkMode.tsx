"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { type DarkModeCookie } from "@/lib/flags"
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { updateDarkModeCookie } from '@/lib/cookies'
import { getUser } from '@/lib/auth/session'
import { updateDarkModePreferences } from '@/lib/db/queries/user'

export default function UpdateAutoDarkMode({
    darkModeCookie
}: {
    darkModeCookie: DarkModeCookie
}) {
    const [autoDarkMode, setAutoDarkMode] = useState(darkModeCookie.auto_dark_mode)
    const [startTime, setStartTime] = useState((darkModeCookie.startHour < 10 ? "0" + darkModeCookie.startHour : darkModeCookie.startHour) + ":" + (darkModeCookie.startMinute < 10 ? "0" + darkModeCookie.startMinute : darkModeCookie.startMinute) + ":00")
    const [endTime, setEndTime] = useState((darkModeCookie.endHour < 10 ? "0" + darkModeCookie.endHour : darkModeCookie.endHour) + ":" + (darkModeCookie.endMinute < 10 ? "0" + darkModeCookie.endMinute : darkModeCookie.endMinute) + ":00")

    return (
        <Card className="w-fit">
            <CardHeader className={`flex flex-row items-center gap-2 space-y-0 ${!autoDarkMode && "xl:pb-6"}`}>
                <Checkbox
                    id="auto-dark-mode"
                    defaultChecked={autoDarkMode}
                    onCheckedChange={async () => {
                        setAutoDarkMode(!autoDarkMode)

                        const newCookie = {
                            ...darkModeCookie,
                            auto_dark_mode: !autoDarkMode
                        }

                        await updateDarkModeCookie(newCookie)
                        const user = await getUser()
                        if (user) {
                            await updateDarkModePreferences({
                                userId: user.id,
                                darkModeCookie: newCookie
                            })
                        }
                    }}
                />
                <CardTitle className="text-base xl:text-lg">Auto Dark Mode</CardTitle>
            </CardHeader>
            {
                autoDarkMode && (
                    <CardContent className="flex flex-row items-center gap-2">
                        <Input
                            type="time"
                            defaultValue={startTime}
                            onChange={async (e) => {
                                setStartTime(e.target.value)
                                const [hours, minutes, seconds] = e.target.value.split(':')

                                const newCookie = {
                                    ...darkModeCookie,
                                    startHour: parseInt(hours),
                                    startMinute: parseInt(minutes)
                                }

                                await updateDarkModeCookie(newCookie)
                                const user = await getUser()
                                if (user) {
                                    await updateDarkModePreferences({
                                        userId: user.id,
                                        darkModeCookie: newCookie
                                    })
                                }
                            }}
                        />
                        <Label className="text-base xl:text-lg">to</Label>
                        <Input
                            type="time"
                            defaultValue={endTime}
                            onChange={async (e) => {
                                setEndTime(e.target.value)
                                const [hours, minutes, seconds] = e.target.value.split(':')

                                const newCookie = {
                                    ...darkModeCookie,
                                    endHour: parseInt(hours),
                                    endMinute: parseInt(minutes)
                                }

                                await updateDarkModeCookie(newCookie)
                                const user = await getUser()
                                if (user) {
                                    await updateDarkModePreferences({
                                        userId: user.id,
                                        darkModeCookie: newCookie
                                    })
                                }
                            }}
                        />
                    </CardContent>
                )
            }
        </Card>
    )
}