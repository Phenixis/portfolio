import Project from "./project";

export default function Projects() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Project name="Portfolio" description="The backend of this website, which is an app where I manage my tasks, projects, calendars, workouts, etc." color="purple" state="Running" />
            <Project name="Boilerplate.md" description="The best open-source boilerplate for NextJS." color="blue" state="Discontinued" />
            <Project name="Wisecart" description="The perfect app to make your shopping list in seconds." color="green" state="Discontinued" />
            <Project name="ScriptAI" description="Your writer assistant specialized in storytelling" color="red" state="Discontinued" />
            <Project name="GRFICS" description="Graphical Realism Framework for Industrial Control Simulation" color="orange" state="Built" />
            <Project name="Metro Railway emulator" description="A simulation of multiple trains running on different tracks with controls signals." color="yellow" state="Built" />
            <Project name="Multi-vlc" description="A very simple application that controls multiple VLC instances on different computers." color="green" state="Built" />
        </div>
    )
}