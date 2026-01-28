import { useState } from 'react';
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;



export default function Login({
    getProducts,
    setIsAuth,
}) {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    // 綁監聽，(preData)保證取得前一次的值
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((preData) => ({
            ...preData,
            [name]: value,
        }));
    };

    //登入api，設定cookies，取token
    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post(`${API_BASE}/admin/signin`, formData)
            const { token, expired } = res.data;
            document.cookie = `myToken=${token};expires=${new Date(expired)};`;
            axios.defaults.headers.common['Authorization'] = `${token}`;
            getProducts();
            setIsAuth(true);

        } catch (error) {
            setIsAuth(false);
            console.error(error.response?.data);
        }
    };



    return (<>
        <div className="container login">
            <h2>🌿 歡迎進入種子手作工坊 🌿</h2>
            <br />
            <form className="form-floating" onSubmit={onSubmit}>{/*綁定*/}
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        name="username"
                        value={formData.username} //綁定上面函式
                        onChange={(e) => handleInputChange(e)} //綁定事件監聽
                    />
                    <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Password"
                        value={formData.password} //綁定上面函式
                        onChange={(e) => handleInputChange(e)} //綁定事件監聽
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-un w-100 mt-3">登入</button>
            </form>

        </div>


    </>)

}