import GithubCalendar from '/app/ui/components/github-calendar';
import Quote from '/app/ui/components/quote';
import Header from '/app/ui/components/header';
import Image from 'next/image';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-4 h-screen md:m-12">
            <Header />
            <main className="mt-6 md:mt-8 flex flex-col items-center w-full">
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
                <div className='min-w-7/12 max-w-full'>
                    <div className='flex flex-col items-center w-full'>
                        <Image className="rounded-full" src="/pdp.jpg" alt="A picture of me" width={200} height={200}/>
                        <div className='w-full'>
                            <p className="text-lg font-semibold lg:text-2xl">Hello! I'm Maxime Duhamel</p>
                            <p className='lg:text-lg'>
                                I'm a computer science student at the <a href="https://iut-lannion.univ-rennes.fr/" title="the UIT website" className='underline'>University Institute of Technology in Lannion.</a> I'm specialized in the administration, the management and the exploitation of data.
                            </p>
                            <div className='flex justify-end lg:text-lg'>
                                <p className='font-bold p-2 rounded-lg shadow-lg shadow-black-700'>
                                    <a href="https://www.canva.com/design/DAFuEEd36CM/BbgwPzNszoiUH_AkGxfYPQ/view?utm_content=DAFuEEd36CM&utm_campaign=designshare&utm_medium=link&utm_source=editor" target='_blank' title="My resumee" className='underline'>
                                        Get a copy of my resumee &gt;
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </main>
        </main>
    )
}