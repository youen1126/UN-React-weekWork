
//主控layout 放header、footer

import { Outlet, NavLink } from "react-router"


export default function FrontendLayout() {
    return (<>
        <header className="align-items-center text-white"
            style={{
                minHeight: "5vh",
                backgroundColor: "#493c33",
            }}>
            <ul className="nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" >
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/product" >
                        商品列表
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/cart" >
                        購物車
                    </NavLink>
                </li>
            </ul>
        </header>

        <main>
            <Outlet />
        </main>

        <footer className="align-items-center text-white"
            style={{
                minHeight: "10vh",
                backgroundColor: "#737c75",
            }}>
            <p className="text-center p-4">© 2026 我的React專班個人作業網站</p>
        </footer>

    </>)
};