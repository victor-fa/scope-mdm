// 数组或者对象深拷贝
export function coppyArray(arr) {
  return arr.map(e => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}
// 数组去重
export function arrayDifferent(arr1, arr2, arr5) {
  // 数组去重
  arr1.forEach((a) => {
    const c = arr2.findIndex(b => a === b)
    if (c > -1) delete arr2[c]
    else arr5.push(a)
  })
  return arr5
// var arr1 = ["", "100", "120", "125", "125", "130", "130"];
// var arr2 = ["", "120", "125", "125", "130"];
// var arr3 = [];
// arr1.forEach((a)=>{
//     let c = arr2.findIndex(b=>a == b);
//     if (c > -1) delete arr2[c];
//     else arr3.push(a);
// });
// console.log(arr3)  //["100", "130"]
}
