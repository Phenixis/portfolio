'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"

export default function DarkModeToggle({
    className
}: {
    className?: string;
}) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    // Load dark mode preference from localStorage on mount
    useEffect(() => {
        try {
            const savedPreference = localStorage.getItem('darkMode');
            const dialogAnswer = localStorage.getItem('dialogAnswer');

            console.log('Saved Preference:', savedPreference);
            console.log('Dialog Answer:', dialogAnswer);

            if (savedPreference === 'false') {
                const currentHour = new Date().getHours();
                if (currentHour >= 19 && dialogAnswer === null) {
                    setIsDarkMode(true);
                    document.documentElement.classList.add('dark');
                    setShowDialog(true);
                } else if (dialogAnswer === 'true') {
                    setShowDialog(false);
                    setIsDarkMode(true);
                    document.documentElement.classList.add('dark');
                } else {
                    setShowDialog(false);
                    setIsDarkMode(false);
                    document.documentElement.classList.remove('dark');
                }
            } else if (savedPreference === 'true') {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            } else {
                // Fallback: Check the current time to set dark mode
                const currentHour = new Date().getHours();
                if (currentHour >= 19 && dialogAnswer !== 'true') {
                    setShowDialog(true);
                }
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            localStorage.setItem('darkMode', newMode.toString());
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleDialogResponse = (response: boolean) => {
        setShowDialog(false);
        localStorage.setItem('dialogAnswer', response.toString());
        if (response) {
            setIsDarkMode(true);
            localStorage.setItem('darkMode', 'true');
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            localStorage.setItem('darkMode', 'false');
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div>
            <div
                onClick={toggleDarkMode}
                role="button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={cn(
                    "lg:hover:rotate-[46deg] duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:lg:hover:text-neutral-500 cursor-pointer",
                    className
                )}
            >
                {isDarkMode ? <Moon /> : <Sun />}
            </div>

            {showDialog && (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>It's getting late</DialogTitle>
                            <DialogDescription>
                                It's getting late and dark and I don't want to flash you, do you want to turn on dark mode?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="secondary"
                                size="default"
                                onClick={() => handleDialogResponse(false)}
                                className=''
                            >
                                No
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={() => handleDialogResponse(true)}
                                className=""
                            >
                                Yes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}