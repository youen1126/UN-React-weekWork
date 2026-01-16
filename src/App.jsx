import { useState } from 'react';
import axios from "axios";
import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// import './App.css'

function App() {

  //表單資料狀態（存入表單輸入）
  const [formData, setFormData] = useState({
    username: "youen1126@gmail.com",
    password: "",
  });
  //登入狀態管理
  const [isAuth, setIsAuth] = useState(false);
  //產品資料狀態
  const [products, setProducts] = useState([]);
  //目前選中的產品
  const [tempProduct, setTempProduct] = useState(null);

  //登入取值  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(res.data.products)
    } catch (error) {
      console.log(error.response)
    }
  }
  //登入取token、取得產品資料
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData)
      // console.log(res.data);
      //取得token並存入cookie
      const { token, expired } = res.data
      document.cookie = `myToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = `${token}`;

      setIsAuth(true);
      //取得產品資料
      getProducts();
    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  };

  //確認登入
  async function checkLogin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("myToken="))
        ?.split("=")[1];
      //console.log(token);
      const res = await axios.post(`${API_BASE}/api/user/check`)
      axios.defaults.headers.common.Authorization = token;
      console.log(res);

    } catch (error) {
      console.log(error.response?.data.message);
    }
  }


  return (
    <>
      {!isAuth ? (<div className="container login">
        <h1>請先登入</h1>
        <form className="form-floating" onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-info w-100 mt-2">登入</button>
        </form>

      </div>) : (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <button
                className="btn btn-danger mb-5"
                type="button"
                onClick={checkLogin}
              >
                確認是否登入
              </button>
              <h2>產品列表</h2>
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
                        <button className="btn btn-primary" onClick={() => setTempProduct(item)}>查看細節</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
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
                          <div className="p-3" key={i + idx}>
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
