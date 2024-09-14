import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

export default function Quote({ quote, author }) {
    return (
        <div className="m-2 p-4 bg-base-200 rounded-lg border-2 border-base-content space-y-2 h-full w-full">
            <p className="text-lg font-semibold font-serif"><span className="italic">{author}</span> once said :</p>
            <div>
                <FaQuoteLeft className="fill-base-content" />
                <p className="text-lg font-bold text-center font-serif">{quote}</p>
                <div className="flex justify-end">
                    <FaQuoteRight className="fill-base-content" />
                </div>
            </div>
        </div>
    );
}