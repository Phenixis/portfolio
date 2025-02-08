

export default function Page() {
    return (
        <section className="page">
            <h1 className="page-title">
                My Projects
            </h1>
            <p>
                All my projects share a common goal :
                <ul className="list-decorated">
                    <li>
                        <Image src={listStyle} width={16} height={16} alt="list-style" />
                        <p>
                            to make me write regularly
                        </p>
                    </li>
                </ul>
            </p>
        </section>
    )
}