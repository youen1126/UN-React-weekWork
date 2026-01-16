import { useState } from 'react';
import axios from "axios";
import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


function App() {

    //由下方handleInputChange控制變更setFormData
    const [formData, setFormData] = useState({
        username: "youen1126@gmail.com",
        password: "awe592busy557",
    });

    const [isAuth, setIsAuth] = useState(false); //預設成登入頁面
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState(null);

    const [checkText, setCheckText] = useState(null);

    // //登入取值，綁監聽，(preData)保證取得前一次的值
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((preData) => ({
            ...preData,
            [name]: value,
        }));
    };

    //取得遠端products data
    const getProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
            setProducts(res.data.products)
        } catch (error) {
            console.error(error.response?.data)
        }
    }


    //登入api，設定cookies，取token
    const onSubmit = async (e) => {
        try {
            e.preventDefault(); // 清預設事件
            const res = await axios.post(`${API_BASE}/admin/signin`, formData)

            //取得token並存入cookie
            const { token, expired } = res.data;
            document.cookie = `myToken=${token};expires=${new Date(expired)};`;
            //存axios的Auth
            axios.defaults.headers.common['Authorization'] = `${token}`;
            //取得產品資料
            getProducts();
            //控制切換畫面
            setIsAuth(true);

        } catch (error) {
            setIsAuth(false);
            console.error(error.response?.data);
        }
    };

    //確認登入函式
    async function checkLogin() {
        try {
            // 取得token的方法，複製文件的來用
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("myToken="))
                ?.split("=")[1];

            const res = await axios.post(`${API_BASE}/api/user/check`)
            axios.defaults.headers.common.Authorization = token;
            console.warn(res.data);
            setCheckText('有取得token，成功登入');
        } catch (error) {
            console.error(error.response?.data.message);
        }
    }


    return (
        <>
            {!isAuth ? (<div className="container login">
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

            </div>) : (
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <button
                                className="btn btn-un mb-3"
                                type="button"
                                onClick={checkLogin}
                            >
                                這裡點擊確認是否登入
                            </button>
                            <p>{checkText}</p> {/*有登入成功這個字會顯示在畫面*/}
                            <h2>🌿 產品列表 🌿</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>產品名稱</th>
                                        <th>原價</th>
                                        <th>售價</th>
                                        <th>是否啟用</th>
                                        <th>查看細節</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item) => (
                                        <tr key={item.num}>
                                            <td>{item.title}</td>
                                            <td>{item.origin_price}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                {item.is_enabled ? '啟用' : '未啟用'}
                                            </td>
                                            <td>
                                                <button className="btn btn-un-produck" onClick={() => setTempProduct(item)}>查看細節</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <h2>🌿 單一產品細節 🌿</h2>
                            {tempProduct ? (
                                <div className="card m-3" >
                                    <img src={tempProduct.imageUrl}
                                        className="card-img-top"
                                        alt="主圖" />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {tempProduct.title}
                                            <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                                        </h5>
                                        <p className="card-text">商品描述：{tempProduct.description}</p>
                                        <p className="card-text">商品內容：{tempProduct.content}</p>
                                        <div className="d-flex">
                                            <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
                                            元 / {tempProduct.price} 元
                                        </div>
                                        <h5 className="mt-3">更多圖片：</h5>
                                        <div className="p-2">
                                            {
                                                tempProduct.imagesUrl?.map((i, idx) => (
                                                    <div className="p-2" key={i + idx}>
                                                        <img
                                                            src={i}
                                                            style={{ height: "100px", borderRadius: 8 }}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-secondary">請選擇一個商品查看</p>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </>


    );
}

export default App;
