import Project from "./project";

export default function Projects() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Project name="Wisecart" description="The perfect app to make your shopping list in seconds." color="green" link="https://wisecart.app" state="Discontinued" image="/wisecart.png" />
            <Project name="Boilerplate.md" description="The best open-source boilerplate for NextJS." color="blue" link="https://boilerplate.maximeduhamel.com" state="Running" />
            <Project name="ScriptAI" description="Your writer assistant specialized in storytelling" color="red" link="https://boilerplate.maximeduhamel.com" state="Building" />
        </div>
    )
}