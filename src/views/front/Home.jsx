
import { Link } from "react-router";

export default function Home() {
    return (
        <>
            {/* 主視覺 Banner */}
            <section
                className="d-flex align-items-center"
                style={{
                    minHeight: "60vh",
                    backgroundImage: `
            linear-gradient(
              rgba(73, 60, 51, 0.35),
              rgba(209, 92, 29, 0.25)
            ),
            url("https://images.unsplash.com/photo-1642866081289-d8f60613a3e6?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="container text-center text-md-start">
                    <div className="row">
                        <div className="col-md-6 text-white">
                            <h1 className="fw-bold mb-3">
                                秋日選物，溫柔上架
                            </h1>
                            <p className="mb-4" style={{ color: "#f1ebcc" }}>
                                精選生活好物，為日常留下一點暖光。
                            </p>

                            <Link
                                to="/product"
                                className="btn btn-lg"
                                style={{
                                    backgroundColor: "#f1ebcc",
                                    color: "#493c33",
                                }}
                            >
                                前往商品列表
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 關於我們 */}
            <section
                className="d-flex align-items-center"
                style={{
                    minHeight: "40vh",
                    backgroundImage: `url("https://images.unsplash.com/photo-1696521940070-eb48653a87bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
          `,
                }}
            >
                <div className="container text-center">
                    <h2
                        className="fw-bold"
                        style={{
                            color: "#a0bebf",
                            letterSpacing: "0.05em",
                        }}
                    >
                        關於我們
                    </h2>
                    <h4 className="mt-4" style={{ color: "#a0bebf" }}>
                        把自然留下來，成為生活的一部分
                    </h4>
                    <p className="mt-2" style={{ color: "#a0bebf" }}>
                        每一顆種子，來自真實的土地與時間。
                        <br />
                        我們將天然素材與手作工藝結合，
                        <br />
                        讓裝飾不只是擺設，而是一段與自然共存的日常。
                    </p>
                </div>
            </section>

        </>
    );
}
