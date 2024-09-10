import GithubCalendar from '/app/ui/github-calendar';
import Quote from '/app/ui/quote';
import Header from '/app/ui/components/header';
import Image from 'next/image';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-4 h-screen sm:m-12">
            <Header />
            <main className="mt-6 sm:m-8 flex flex-col items-center w-full">
                <div className='flex flex-col justify-around w-full h-max sm:space-x-4 sm:flex-row'>
                    <div className='flex flex-col items-start space-y-1 sm:items-end sm:justify-between'>
                        <Quote quote="Be impatient with your inputs and patient with your outputs." author="Alex Hormozi" />
                        <Image src="/the_principle.png" alt="Le Principe" width={200} height={90} />
                    </div>
                    <div className='flex flex-col items-end space-y-1 sm:items-start sm:justify-between'>
                        <GithubCalendar />
                        <Image src="/the_actions.png" alt="Le Principe" width={200} height={92}/>
                    </div>
                </div>
            </main>
        </main>
    )
}