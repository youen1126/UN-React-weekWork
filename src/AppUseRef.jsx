
// useRef 不受元件影響

// React基本生命週期概念：初始化 > 畫面渲染 > useEffect > setState（useRef不在這條執行順序上，就像平行時空一樣）

// 作用域JS 

// useRef 所定義的值不會被重置


import { useState, useEffect, useRef } from "react"

import Chart from 'chart.js/auto';

let num = 0;
function AppUseRef() {
    const [count, setCount] = useState(1);
    const [count2, setCount2] = useState(1);
    const ref = useRef(1) // useRef的平行時空（不太會這麼用，只是拿來裡解react運作）
    const btnRef = useRef(null);
    console.warn('元件運行次數', num);
    num++;

    useEffect(() => {
        console.warn(btnRef.current);

    }, [])

    useEffect(
        () => {
            // console.warn('useEffect 執行次數：', num);//放在useEffect之外，初始化會抓不到值
            const btn1 = document.querySelector('#btn1');
            // console.warn('btn1:', btn1);
        },
        [count]
    )


    useEffect(
        () => {
            // console.warn('useEffect 執行次數：', num);
            const btn2 = document.querySelector('#btn2');
            // console.warn('btn2:', btn2);
        },
        [count2]
    )

    //console.log('ref:', ref);

    const canvasRef = useRef(null);
    useEffect(() => {
        new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })

    //這邊可以補立即函式嗎？不好


    return (<>
        <h1>圖表</h1>
        <canvas ref={canvasRef}></canvas>
        <h2>AppUseEffect</h2>
        <button ref={btnRef} id="btn1" type="button" onClick={() => {
            setCount(count + 1)
        }}>{count}</button>

        <button id="btn2" type="button" onClick={() => {
            setCount2(count + 1)
        }}>{count2}</button>
        <hr />
        <button type="button" onClick={() => {
            ref.current++;
        }}>{ref.current}</button>

    </>)
}

export default AppUseRef


