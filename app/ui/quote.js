import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

export default function Quote({ quote, author }) {
    return (
        <div className="m-2 p-4 bg-[#ece0d1] rounded-lg border-2 w-[25rem] border-[#38220f] space-y-2">
            <p className="text-md font-semibold font-serif"><span className="italic">{author}</span> once said :</p>
            <div>
                <FaQuoteLeft className="fill-[#38220f]" />
                <p className="text-lg font-bold text-center font-serif">{quote}</p>
                <div className="flex justify-end">
                    <FaQuoteRight className="fill-[#38220f]" />
                </div>
            </div>
        </div>
    );
}