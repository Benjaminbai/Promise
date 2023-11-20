# Promise
realize promise

[Promise 必知必会（十道题）](https://zhuanlan.zhihu.com/p/30797777)
1. promise的构造函数是同步执行的，promise.then是异步
2. promise有三种状态，一旦改变，就不能在变
3. 构造函数中的 resolve 或 reject 只有第一次执行有效，多次调用没有任何作用，呼应代码二结论：promise 状态一旦改变则不能再变
4. promise调用.then或.catch都会返回一个新的promise对象，故能够链式调用
5. .then和.catch中return一个error对象，并不回抛出错误，所以不会被catch捕获，可改写 
    - return Promise.reject(new Error())
    - throw new Error()
6. .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环
7. .then 或者 .catch 的参数，期望是函数，倘若不是函数，会发生值穿透
8. .then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。
    - .catch 是 .then 第二个参数的简便写法，但是它们用法上有一点需要注意：
    - .then 的第二个处理错误的函数捕获不了第一个处理成功的函数抛出的错误，
    - 而后续的 .catch 可以捕获之前的错误


[实现promise](https://juejin.cn/post/7259647015604863013?searchId=20231120111637040FBFD503DF39CE06F8)
