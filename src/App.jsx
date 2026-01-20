import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./assets/style.css";
import * as bootstrap from 'bootstrap'

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

  //由下方handleInputChange控制變更setFormData
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [seeProduct, setSeeProduct] = useState(null);

  const [templeteProduct, setTempleteProduct] = useState(INITIAL_TEMPLATE_DATA);

  //const [updataText, setUpdataText] = useState(null);

  const [modalType, setModalType] = useState();

  const productModalRef = useRef(null);

  // 綁監聽，(preData)保證取得前一次的值
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //編輯時，輸入框value輸入值
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    setTempleteProduct((pre) => ({
      ...pre,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //編輯時，圖片因為是陣列的格式，所以要特殊處理
  const handelModalImageChange = ((index, value) => {
    setTempleteProduct((pre) => {
      const newImage = [...pre.imagesUrl]
      newImage[index] = value;
      //有空可以優化：自動加空輸入框、最多5筆圖片資料、網址刪掉時自動少一個框
      return {
        ...pre,
        imagesUrl: newImage
      }
    })
  });

  //表單新增圖片按鈕
  const handelAddImage = (() => {
    setTempleteProduct((pre) => {
      const newImage = [...pre.imagesUrl, ""];
      //newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage
      }
    })
  });

  //表單移除圖片按鈕
  const handelRemoveImage = (() => {
    setTempleteProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage
      }
    })
  });


  //取得遠端products data
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(res.data.products)
    } catch (error) {
      console.error(error.response?.data)
    }
  };

  //更新編輯產品api
  const undateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`
    let method = 'post'

    if (modalType === 'edit') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      method = 'put'
    }

    const productData = {
      data: {
        ...templeteProduct,
        origin_price: Number(templeteProduct.origin_price),
        price: Number(templeteProduct.price),
        is_enabled: templeteProduct.is_enabled ? 1 : 0,
        //圖片防呆
        imagesUrl: [...templeteProduct.imagesUrl.filter(url => url !== "")],
      }
    }

    try {
      alert('請等候畫面更新');
      const res = await axios[method](url, productData);
      console.warn(res.data);
      alert('產品已更新或儲存');
      getProducts();
      closeModal();

    } catch (error) {
      alert('表單不可為空或你有未填項目');
      console.warn(error.response);
    }
  }

  //刪除商品api

  const delProduct = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`)
      console.warn(res.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.warn(error.response);
    }
  }

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
        console.warn('有取得token,成功登入');
        //res.data.
        setIsAuth(true);
        getProducts();

      } catch (error) {
        console.error(error.response?.data.message);
      }
    }
    checkLogin()
  }, []);

  const openModal = (type, product) => {
    //console.log(product)
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
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={productModalRef}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className={`modal-header btn-un-${modalType === 'delete' ? 'danger' : 'produck'} text-white`}>
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalType === 'delete' ? '刪除' :
                  modalType === 'edit' ? '編輯' : '新增'
                }產品</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/*刪除的modal */}
              {
                modalType === 'delete' ? (

                  <p className="fs-4">
                    確定要刪除
                    <span className="text-danger">{templeteProduct.title}</span>嗎？
                  </p>
                ) : (
                  <div className="row">
                    {/* 表單左邊 */}
                    <div className="col-sm-4">
                      <div className="mb-2">
                        <div className="mb-3">
                          <label htmlFor="imageUrl" className="form-label">
                            輸入圖片網址
                          </label>
                          <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            className="form-control"
                            placeholder="請輸入圖片連結"
                            value={templeteProduct.imageUrl}
                            onChange={handleModalInputChange}
                          />
                        </div>

                        <div>
                          {/* 如果 && 前的值存在，就回傳 && 後面的值 */}
                          {templeteProduct.imageUrl && (
                            <img
                              className="img-fluid"
                              src={templeteProduct.imageUrl}
                              alt="主圖"
                            />
                          )}
                        </div>

                        <div>
                          {templeteProduct.imagesUrl?.map((url, index) => (
                            <div key={index}>
                              <label htmlFor={`imageUrl-${index}`} className="form-label">
                                輸入圖片網址
                              </label>
                              <input
                                id={`imageUrl-${index}`}
                                type="text"
                                className="form-control"
                                placeholder={`圖片網址${index + 1}`}
                                value={url}
                                // 補圖片的 onChange 處理
                                onChange={(e) => handelModalImageChange(index, e.target.value)}
                              />
                              {url && (
                                <img
                                  className="img-fluid"
                                  src={url}
                                  alt={`副圖${index + 1}`}
                                />
                              )}
                            </div>
                          ))}
                          {
                            templeteProduct.imagesUrl.length < 5 &&
                            templeteProduct.imagesUrl[templeteProduct.imagesUrl.length - 1] !== "" &&
                            <div>
                              <button className="btn btn-outline-info btn-sm d-block w-100"
                                onClick={() => handelAddImage()}
                              >
                                新增圖片
                              </button>
                            </div>
                          }
                          <br />
                          {templeteProduct.imagesUrl.length >= 1 &&
                            <div>
                              <button className="btn btn-outline-warning btn-sm d-block w-100"
                                onClick={() => handelRemoveImage()}
                              >
                                刪除圖片
                              </button>
                            </div>
                          }

                        </div>
                      </div>
                    </div>

                    {/* 表單右邊 */}
                    <div className="col-sm-8">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          標題
                        </label>
                        <input
                          name="title"
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="請輸入標題"
                          value={templeteProduct.title}
                          onChange={handleModalInputChange}
                        />
                      </div>

                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label htmlFor="category" className="form-label">
                            分類
                          </label>
                          <input
                            name="category"
                            id="category"
                            type="text"
                            className="form-control"
                            placeholder="請輸入分類"
                            value={templeteProduct.category}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="unit" className="form-label">
                            單位
                          </label>
                          <input
                            name="unit"
                            id="unit"
                            type="text"
                            className="form-control"
                            placeholder="請輸入單位"
                            value={templeteProduct.unit}
                            onChange={handleModalInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label htmlFor="origin_price" className="form-label">
                            原價
                          </label>
                          <input
                            name="origin_price"
                            id="origin_price"
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="請輸入原價"
                            value={templeteProduct.origin_price}
                            onChange={handleModalInputChange}
                          />
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="price" className="form-label">
                            售價
                          </label>
                          <input
                            name="price"
                            id="price"
                            type="number"
                            min="0"
                            className="form-control"
                            placeholder="請輸入售價"
                            value={templeteProduct.price}
                            onChange={handleModalInputChange}
                          />
                        </div>
                      </div>

                      <hr />

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          產品描述
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          className="form-control"
                          placeholder="請輸入產品描述"
                          value={templeteProduct.description}
                          onChange={handleModalInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                          說明內容
                        </label>
                        <textarea
                          name="content"
                          id="content"
                          className="form-control"
                          placeholder="請輸入說明內容"
                          value={templeteProduct.content}
                          onChange={handleModalInputChange}
                        />
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            name="is_enabled"
                            id="is_enabled"
                            className="form-check-input"
                            type="checkbox"
                            checked={templeteProduct.is_enabled}
                            onChange={(e) =>
                              handleModalInputChange({
                                target: {
                                  name: 'is_enabled',
                                  value: e.target.checked,
                                },
                              })
                            }
                          />
                          <label className="form-check-label" htmlFor="is_enabled">
                            是否啟用
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>)
              }
            </div>

            <div className="modal-footer">
              {
                modalType === 'delete' ? (<button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => delProduct(templeteProduct.id)}
                >刪除</button>) : (<><button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                  <button type="button" className="btn btn-info"
                    onClick={() => undateProduct(templeteProduct.id)}
                  >
                    確認
                  </button></>)
              }
            </div>
          </div>
        </div>
      </div>


    </>
  );

}



export default App;