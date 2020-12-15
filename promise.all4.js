
Promise.prototype.all = function (arr) {
    let result = []
    let arrLen = arr.length
    let count = 0
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