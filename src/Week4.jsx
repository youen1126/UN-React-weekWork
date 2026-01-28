import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./assets/style.css";
import * as bootstrap from 'bootstrap'
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import Login from './views/Login';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
    id: "",
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [],
};


function App() {

    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const [seeProduct, setSeeProduct] = useState(null);
    const [pagination, setPagination] = useState({});

    const [templeteProduct, setTempleteProduct] = useState(INITIAL_TEMPLATE_DATA);

    const [modalType, setModalType] = useState();

    const productModalRef = useRef(null);



    //取得遠端products data
    const getProducts = async (page = 1) => {
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`)
            setProducts(res.data.products);
            setPagination(res.data.pagination);
        } catch (error) {
            alert(error.response?.data);
        }
    };

    //存token保持登入狀態
    useEffect(() => {

        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("myToken="))
            ?.split("=")[1];
        if (token) {
            axios.defaults.headers.common.Authorization = token;
        }

        //DOM綁
        productModalRef.current = new bootstrap.Modal('#productModal', {
            keyboard: false,
        })

        async function checkLogin() {
            try {

                const res = await axios.post(`${API_BASE}/api/user/check`)
                console.warn('有取得token,成功登入', res.status);
                setIsAuth(true);
                getProducts();
            } catch (error) {
                alert(error.response?.data.message);
            }
        }
        checkLogin()
    }, []);

    const openModal = (type, product) => {
        setModalType(type)
        setTempleteProduct((pre) => ({
            ...pre,
            ...product,
        }));
        productModalRef.current.show();
    }

    const closeModal = () => {
        productModalRef.current.hide();
    };


    return (
        <>
            {!isAuth ? (
                <Login
                    getProducts={getProducts}
                    setIsAuth={setIsAuth}
                />
            ) : (
                <div className="container p-0 my-3">
                    <div className="row mt-5 ">
                        {/*產品列表*/}
                        <div className="col-md-6 ">
                            <h2>🌿 產品列表 🌿</h2>
                            <div className="text-end md-1">
                                <button
                                    type="button"
                                    className="btn btn-un"
                                    onClick={() => { openModal("creat", INITIAL_TEMPLATE_DATA) }}
                                >
                                    建立新的產品
                                </button>
                            </div>
                            <br />
                            <div class="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>分類</th>
                                            <th>產品名稱</th>
                                            <th>原價</th>
                                            <th>售價</th>
                                            <th>是否啟用</th>
                                            <th>查看細節</th>
                                            <th>編輯</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.category}</td>
                                                <td scope='row'>{item.title}</td>
                                                <td>{item.origin_price}</td>
                                                <td>{item.price}</td>
                                                <td>
                                                    {item.is_enabled ? (
                                                        <span className="text-success">啟用</span>
                                                    ) : (
                                                        <span>未啟用</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button className="btn btn-un-produck btn-sm" onClick={() => setSeeProduct(item)}>查看</button>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                                        <button type="button" className="btn btn-outline-info" onClick={() => openModal("edit", item)}>編輯</button>
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => openModal("delete", item)}>刪除</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* 頁碼 */}
                            <div className='m-3'>
                                <Pagination pagination={pagination} onChangePage={getProducts} />
                            </div>
                        </div>
                        {/*單一產品細節*/}
                        <div className="col-md-6">
                            <h2>🌿 單一產品細節 🌿</h2>
                            {seeProduct ? (
                                <div className="card m-3" >
                                    <img src={seeProduct.imageUrl}
                                        className="card-img-top"
                                        alt="主圖" />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {seeProduct.title}
                                            <span className="badge btn-un-produck ms-2">{seeProduct.category}</span>
                                        </h5>
                                        <p className="card-text">商品描述：{seeProduct.description}</p>
                                        <p className="card-text">商品內容：{seeProduct.content}</p>
                                        <div className="d-flex">
                                            <p className="card-text text-secondary"><del>{seeProduct.origin_price}</del></p>
                                            元 / {seeProduct.price} 元
                                        </div>
                                        <h5 className="mt-3">更多圖片：</h5>
                                        <div className="p-2">
                                            {
                                                seeProduct.imagesUrl?.map((i, idx) => (
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
                                <p className="text-write">請選擇一個商品查看</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Modal */}
            <ProductModal modalType={modalType}
                templeteProduct={templeteProduct}
                closeModal={closeModal}
                getProducts={getProducts}

            />
        </>
    );

}



export default App;