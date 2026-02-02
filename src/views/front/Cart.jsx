
import axios from "axios";
import { useEffect, useState } from "react";
import { curryency } from "../../utils/filter";


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Cart() {

    const [cart, setCart] = useState([]); //購物車資料
    const [total, setTotal] = useState(); //訂單總金額

    //啟動時就需要的
    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
                setCart(res.data.data.carts)
                setTotal(res.data.data.final_total)
            } catch (error) {
                console.error(error.respones);
            }
        }
        getCart();
    }, [])

    //更改數量
    const updataCart = async (cartId, productId, qty = 1) => {
        try {
            const data = {
                product_id: productId,
                qty,
            }

            const res = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data });
            console.warn(res.data)
            //alert(res.data.message);
            const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(res2.data.data.carts)
            setTotal(res2.data.data.final_total)
        } catch (error) {
            console.error(error.respones);
        }

    }

    //刪除單一產品
    const deleteItem = async (cartId) => {
        try {
            const res = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
            alert(res.data.message);
            const getCartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(getCartRes.data.data.carts)
            setTotal(getCartRes.data.data.final_total)
        } catch (error) {
            console.error(error.respones);
        }

    }
    //刪除All產品
    const deleteAll = async () => {
        try {
            const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
            alert(res.data.message);
            const getCartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(getCartRes.data.data.carts)
            setTotal(getCartRes.data.data.final_total)
        } catch (error) {
            console.error(error.respones);
        }

    }

    return (
        <div className="container mb-5">
            <h2 className="text-center p-5">購物車列表</h2>
            <div className="text-end mt-4">
                <button type="button" className="btn btn-outline-danger"
                    onClick={deleteAll}
                >
                    清空購物車
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">縮圖</th>
                        <th scope="col">品名</th>
                        <th scope="col">數量/單位</th>
                        <th scope="col">小計</th>
                    </tr>
                </thead>
                <tbody>

                    {cart.map(item => {
                        return (
                            <tr key={item.id}>
                                <td>
                                    <button type="button" className="btn btn-outline-danger btn-sm"
                                        onClick={() => deleteItem(item.id)}>刪除</button>
                                </td>
                                <td><img src={item.product.imageUrl} style={{ height: '60px' }} alt={item.product.title} /></td>
                                <td>{item.product.title}</td>
                                <td>
                                    <div className="input-group input-group-sm mb-1">
                                        <input type="number"
                                            className="form-control"
                                            aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                            defaultValue={item.qty}
                                            onChange={(e) =>
                                                updataCart(
                                                    item.id,
                                                    item.product_id,
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                        <span className="input-group-text"
                                            id="inputGroup-sizing-sm">
                                            {item.product.unit}</span>
                                    </div>
                                </td>
                                <td>{curryency(item.total)}</td>
                                <th scope="row"></th>

                                <td className="text-end"></td>
                            </tr>)
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="text-end" colSpan="3">
                            總計
                        </td>
                        <td className="text-end">
                            {curryency(total)}
                        </td>
                        <td className="text-end"></td>
                    </tr>
                </tfoot>
            </table>
        </div>)
};