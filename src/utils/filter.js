
//將數字轉換為千位分隔符格式 
// 效果： 1314 -> 1,314

export const curryency = (num) => {
    const n = Number(num) || 0
    return n.toLocaleString();
};