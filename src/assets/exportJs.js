

// 預設匯出（沒有名字）一個檔案只能有一個預設匯出
//匯入到其他檔案時，可以在那個檔案再命名，因為預設匯出它沒有名字

//我們之前在寫react時寫的function App()就是預設匯出
//通常最後面會寫：export default App

//以下範例練習
export default function fn() {
    console.warn('卡斯柏');
}

//具名匯出。匯出時必須要有名字
//一個檔案可以有多個具名匯出
//用解構的方式匯入到其他檔案

//通常是函式庫才會用具名匯出，初學應該比較不會去用
//以後如果想寫簡單的函示庫，就可以用

export const myName = '尤莉雅'

export function fnMyName() {
    console.warn('尤莉雅讚讚');
}