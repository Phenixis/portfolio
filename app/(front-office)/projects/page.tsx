import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import Projects from "@/components/big/projects"

export default function Page() {
    return (
        <section className="page space-y-4">
            <h1 className="page-title">
                My Projects
            </h1>
            <Collapsible className="group/collapsible data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-900 border-transparent dark:lg:hover:bg-gray-900 lg:hover:bg-gray-100 rounded-md p-2">
                <CollapsibleTrigger className="flex justify-between gap-4">
                    <p className="text-left">
                        I build web applications since Septembre 2024, but my journey started a long time ago...
                    </p>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col space-y-4">
                    <p className="mt-4">
                        My first ever "technological invention" was born in 2021. I was using the  Google Drive application to synchronize a large number of files (1000~2000) between my computer and my phone.
                    </p>
                    <p>
                        With such number of files, errors happen and Google Drive displayed them one by one for each file. There was no option for ignoring every errors, so it was mandatory to delete them one. by. one.
                    </p>
                    <p>
                        As I was learning how to code in Python, I decided that I would build a small program that would make it for me. There was no API so I needed to use the graphical interface. I searched for a library to move the mouse to click on the 3 dots button, click on "Delete" and start again for the next error.
                    </p>
                    <p>
                        It took me probably a full afternoon to build the program from A to Z, but I had a problem, so I built something to solve it. Since then, the
                        <Tooltip>
                            <TooltipTrigger className="underline cursor-help">
                                producer mindset
                            </TooltipTrigger>
                            <TooltipContent>
                                In opposition with the "consumer" mindset, producters build the solution to their problems instead of buying them.
                            </TooltipContent>
                        </Tooltip> has a little place in a corner of my mind.
                    </p>
                </CollapsibleContent>
            </Collapsible>
            <Projects />
        </section>
    )
}