export default function Quote({ quote, author }) {
    return (
        <div className="m-2 p-4 bg-[#ece0d1] rounded-lg border-2 w-[25rem] border-[#38220f]">
            <p className="text-lg font-bold text-center font-serif">{quote}</p>
            <div className="flex justify-end">
                <p className="text-md font-semibold font-serif">- {author}</p>
            </div>
        </div>
    );
}