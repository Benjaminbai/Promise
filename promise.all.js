// Promise.all = arr => {
//     let aResult = []
//     return new Promise(function (resolve, reject) {
//         let i = 0
//         next()
//         function next() {
//             arr[i].then(res => {
//                 aResult.push(res)
//                 i++
//                 if (i == arr.length) {
//                     resolve(aResult)
//                 } else {
//                     next()
//                 }
//             })
//         }
//     })
// }


Promise.prototype.all = function (arr) {
    let result = []
    let count = 0
    let arrLen = arr.length
    return new Promise(function (resolve, reject) {
        for (let val of arr) {
            Promise.resolve(val).then(function (res) {
                count++
                result[count] = res
                if (count === arrLen) {
                    return resolve(result)
                }
            }, function (err) {
                return reject(err)
            })
        }
    })
}