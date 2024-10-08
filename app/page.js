import GithubCalendar from '/app/ui/components/github-calendar';
import Quote from '/app/ui/components/quote';
import Header from '/app/ui/components/header';
import Image from 'next/image';
import { SlArrowRight } from "react-icons/sl";

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-2 h-screen md:m-6">
            <Header />
            <main className="pt-6 md:p-8 flex flex-col items-center w-[95%] space-y-6">
                <div className='flex flex-col justify-around w-full h-max md:space-y-2 md:space-x-4'>
                    <div className='flex flex-col md:flex-row'>
                        <Quote quote="Be impatient with your inputs and patient with your outputs." author="Alex Hormozi" />
                        <div className='block md:hidden'>
                            <Image src="/the_principle.png" alt="Le Principe" width={200} height={90} />
                        </div>
                        <GithubCalendar />
                        <div className='block flex justify-end md:hidden'>
                            <Image src="/the_actions.png" alt="Le Principe" width={200} height={92}/>
                        </div>
                    </div>
                    <div className='hidden md:flex justify-around w-full'>
                        <Image src="/the_principle.png" alt="Le Principe" width={200} height={90} />
                        <Image src="/the_actions.png" alt="Le Principe" width={200} height={92}/>
                    </div>
                </div>
                <div className='min-w-7/12 max-w-full bg-secondary p-4 rounded-xl'>
                    <div className='flex flex-col items-center w-full'>
                        <div className="avatar">
                            <div className="w-48 rounded-full">
                                <img src="pdp.jpg" />
                            </div>
                        </div>
                        <div className='w-full'>
                            <p className="text-lg font-bold lg:text-2xl text-neutral">Hello! I'm Maxime Duhamel</p>
                            <p className='lg:text-lg'>
                                I'm a computer science student at the <a href="https://iut-lannion.univ-rennes.fr/" title="the UIT website" className='underline'>University Institute of Technology in Lannion.</a> I'm specialized in the administration, the management and the exploitation of data.
                            </p>
                            <div className='flex justify-end lg:text-lg'>
                                <a href="https://www.canva.com/design/DAFuEEd36CM/BbgwPzNszoiUH_AkGxfYPQ/view?utm_content=DAFuEEd36CM&utm_campaign=designshare&utm_medium=link&utm_source=editor" target='_blank'>
                                    <button className="btn btn-neutral font-bold text-base-100">
                                        Get a copy of my resumee
                                        <SlArrowRight className='animate-bounceH'/>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </main>
    )
}