'use client'

export default function ContactMe() {
    return (
        <div>
            <div className="h-full content-center">
                <button 
                    onClick="mailto:max@maximeduhamel.com"
                    className="text-lg p-2 rounded-xl shadow-xl shadow-black-700 font-bold border-black border-2 duration-200 hover:shadow-inner">
                        Contact Me
                </button>
            </div>
        </div>
    );
}