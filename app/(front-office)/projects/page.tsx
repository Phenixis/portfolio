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
import Project, { colorVariants, states } from "@/components/big/project"
import projects from "./projects.json"


export default function Page() {
    return (
        <section className="page space-y-4">
            <h1 className="page-title">
                My Projects
            </h1>
            <Collapsible className="group/collapsible data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-900 border-transparent dark:lg:hover:bg-gray-900 lg:hover:bg-gray-100 rounded-md p-2">
                <CollapsibleTrigger className="flex justify-between items-center gap-4">
                    <p className="text-left">
                        I build web applications since Septembre 2024, but my journey started a long time ago...
                    </p>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col space-y-4">
                    <p className="mt-4">
                        My first ever &quot;technological invention&quot; was born in 2021. I was using the  Google Drive application to synchronize a large number of files (1000~2000) between my computer and my phone.
                    </p>
                    <p>
                        With such number of files, errors happenned often and Google Drive displayed them one by one for each file. There was no option for ignoring every errors, so I had to delete them one. by. one.
                    </p>
                    <p>
                        As I was learning how to code in Python, I decided that I would build a small program that would do it for me. There was no API so I used the graphical interface. I searched for a library to move the mouse to click on the 3 dots button, click on &quot;Delete&quot; and start again for the next error.
                    </p>
                    <p>
                        It took me probably a full afternoon to build the program from A to Z, but I had a problem, and I built something to solve it. Since then, the
                        <Tooltip>
                            <TooltipTrigger className=" inline-block underline cursor-default">
                                producer mindset
                            </TooltipTrigger>
                            <TooltipContent>
                                In opposition with the &quot;consumer&quot; mindset, producters build the solution to their problems instead of buying them.
                            </TooltipContent>
                        </Tooltip> has a little place in a corner of my mind.
                    </p>
                    <p>
                        That&apos;s why to this day, I build my own solutions to my problems, and here are the solutions I built.
                    </p>
                </CollapsibleContent>
            </Collapsible>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(projects).map(([key, value]) => (
                    <Project key={key} name={value.name} description={value.description} color={value.color as keyof typeof colorVariants} state={value.state as typeof states[number]} />
                ))}
            </div>
        </section>
    )
}