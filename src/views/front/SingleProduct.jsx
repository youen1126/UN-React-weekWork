import { useParams } from "react-router"
import axios from "axios";
import { useEffect, useState } from "react";


const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function SingleProduct() {


    const { id } = useParams();
    const [item, setItem] = useState();

    useEffect(() => {
        const handleView = async (id) => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`)
                setItem(res.data.product);
            } catch (error) {
                console.error(error.respones);
            }
        };
        handleView(id);
    }, [id]);

    const addCart = async (id, qty = 1) => {
        const data = {
            product_id: id,
            qty,
        };
        try {
            const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data, });
            alert(res.data.message)
        } catch (error) {
            console.error(error.response.data);
        }
    };



    return (
        //防呆措施
        !item ? (<h1>載入中或查無產品</h1>) :
            (< div className="container mt-3">
                <div className="card text-center" style={{ width: '400px' }}>
                    <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                    <div className="card-body">
                        <h4 className="card-title mb-4">{item.title}</h4>
                        <p className="card-text">{item.description}</p>
                        <p className="card-text">原價：<span className="text-body-secondary text-decoration-line-through">{item.origin_price}</span> ｜ 特價：{item.price} <small className="text-body-secondary">$TWD</small></p>

                        <button type="button" className="btn btn-warning"
                            onClick={() => addCart(item.id)}
                        >加入購物車</button>
                    </div>
                </div>
            </div>)
    )
};