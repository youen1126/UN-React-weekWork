import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Products() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`)
                setProducts(res.data.products);
            } catch (error) {
                console.error(error.respones);
            }
        }
        getProduct();
    }, [])

    const handleView = async (id) => {
        navigate(`/product/${id}`)
    };


    return (<>
        <div className="align-items-center text-white p-5" style={{
            minHeight: "5vh",
            backgroundColor: "#493c33",
        }}>
            <div className="row">
                {products.map(item => {
                    return (<div className="col-4 mb-3" key={item.id}>
                        <div className="card mb-3">
                            <img src={item.imageUrl} className="card-img-top" alt={item.title} />
                            <div className="card-body">
                                <h4 className="card-title mb-4">{item.title}</h4>
                                <p className="card-text">{item.description}</p>
                                <p className="card-text">原價：<span className="text-body-secondary text-decoration-line-through">{item.origin_price}</span> ｜ 特價：{item.price} <small className="text-body-secondary">$TWD</small></p>
                                <button type="button" className="btn btn-info mb-2" onClick={() => handleView(item.id)}>查看更多</button>
                                <br />
                                <button type="button" className="btn btn-warning">加入購物車</button>
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        </div>
    </>)
};