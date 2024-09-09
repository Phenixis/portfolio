import GithubCalendar from '/app/ui/github-calendar';
import Quote from '/app/ui/quote';
import Header from '/app/ui/components/header';

export const metadata = {
    title: "Portfolio",
}

export default function Page() {
    return (
        <main className="m-12 h-screen">
            <Header />
            <main className="m-8 flex flex-col items-center">
                <Quote quote="Be impatient with actions and patient with results." author="Naval Ravikant" />
                <p className="text-md text-center">
                    This is why my GitHub activity is so important to me. I try to make a commit every day, even if it's just a small one.
                </p>
                <GithubCalendar />
            </main>
        </main>
    )
}