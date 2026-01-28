import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductModal({
    modalType,
    templeteProduct,
    closeModal,
    getProducts }) {

    const [tempData, setTempData] = useState(templeteProduct);

    //當父元件的templeteProduct更新，這裡的tempData也要更新
    useEffect(() => {
        setTempData(templeteProduct);
    }, [templeteProduct]);

    //編輯時，輸入框value輸入值
    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target;

        setTempData((pre) => ({
            ...pre,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    //編輯時，圖片因為是陣列的格式，所以要特殊處理
    const handelModalImageChange = ((index, value) => {
        setTempData((pre) => {
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
        setTempData((pre) => {
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
        setTempData((pre) => {
            const newImage = [...pre.imagesUrl];
            newImage.pop();
            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    });


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

    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) { return };
        try {
            const formData = new FormData;
            formData.append('file-to-upload', file);

            const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);

            setTempData((pre) => ({
                ...pre,
                imageUrl: res.data.imageUrl
            }))

        } catch (error) {
            console.log(error.response);
        }
    };

    //更新編輯產品api
    const updateProduct = async (id) => {
        let url = `${API_BASE}/api/${API_PATH}/admin/product`
        let method = 'post'

        if (modalType === 'edit') {
            url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`
            method = 'put'
        }

        const productData = {
            data: {
                ...tempData,
                origin_price: Number(tempData.origin_price),
                price: Number(tempData.price),
                is_enabled: tempData.is_enabled ? 1 : 0,
                //圖片防呆
                imagesUrl: [...tempData.imagesUrl.filter(url => url !== "")],
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


    return (<>
        < div
            className="modal fade"
            id="productModal"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
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
                                    <span className="text-danger">{tempData.title}</span>嗎？
                                </p>
                            ) : (
                                <div className="row">
                                    {/* 表單左邊 */}
                                    <div className="col-sm-4">
                                        <div className="mb-2">
                                            <div className="mb-3">
                                                <label htmlFor="fileUpload" className="form-label">
                                                    上傳圖片
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    name="fileUpload"
                                                    id="fileUpload"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={(e) => { uploadImage(e) }}
                                                />
                                            </div>
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
                                                    value={tempData.imageUrl}
                                                    onChange={handleModalInputChange}
                                                />
                                            </div>

                                            <div>
                                                {/* 如果 && 前的值存在，就回傳 && 後面的值 */}
                                                {tempData.imageUrl && (
                                                    <img
                                                        className="img-fluid"
                                                        src={tempData.imageUrl}
                                                        alt="主圖"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                {tempData.imagesUrl?.map((url, index) => (
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
                                                    tempData.imagesUrl.length < 5 &&
                                                    tempData.imagesUrl[tempData.imagesUrl.length - 1] !== "" &&
                                                    <div>
                                                        <button className="btn btn-outline-info btn-sm d-block w-100"
                                                            onClick={() => handelAddImage()}
                                                        >
                                                            新增圖片
                                                        </button>
                                                    </div>
                                                }
                                                <br />
                                                {tempData.imagesUrl.length >= 1 &&
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
                                                value={tempData.title}
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
                                                    value={tempData.category}
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
                                                    value={tempData.unit}
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
                                                    value={tempData.origin_price}
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
                                                    value={tempData.price}
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
                                                value={tempData.description}
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
                                                value={tempData.content}
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
                                                    checked={tempData.is_enabled}
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
                                onClick={() => delProduct(tempData.id)}
                            >刪除</button>) : (<><button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => closeModal()}
                            >
                                取消
                            </button>
                                <button type="button" className="btn btn-info"
                                    onClick={() => updateProduct(tempData.id)}
                                >
                                    確認
                                </button></>)
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

