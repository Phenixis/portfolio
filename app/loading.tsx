import { Loader } from "lucide-react";


export default function Loading() {
    return (
        <div className="w-full min-h-screen flex flex-col space-y-4 items-center justify-center">
            <Loader className="animate-spin size-4" />
        </div>
    )
}