const PENDING = 'pending'
FULFILED = 'fulfilled'
REJECTED = 'rejected';

class Promise {
    constructor(excute) {
        this.PromiseState = PENDING
        this.PromiseResult = undefined

        try {
            excute(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }

        this.callbacks = []
    }

    resolve(result) {
        if (this.PromiseState === PENDING) {
            this.PromiseState = FULFILED
            this.PromiseResult = result
            setTimeout(() => {
                this.callbacks.forEach(cb => {
                    cb.onResolved(this.PromiseResult)
                })
            });
        }
    }

    reject(reason) {
        if (this.PromiseState === PENDING) {
            this.PromiseState = REJECTED
            this.PromiseResult = reason
            setTimeout(() => {
                this.callbacks.forEach(cb => {
                    cb.onRejected(this.PromiseResult)
                })
            });
        }
    }

    then(onResolved, onRejected) {
        return new Promise((resolve, reject) => {
            const callback = fn => {
                try {
                    const result = fn(this.PromiseResult)
                    if (result instanceof Promise) {
                        result.then(
                            res => resolve(res),
                            err => reject(err)
                        )
                    } else {
                        resolve(result)
                    }
                } catch (err) {
                    reject(err)
                }
            }

            if (this.PromiseState === FULFILED) {
                setTimeout(() => {
                    callback(onResolved)
                });
            }
            if (this.PromiseState === REJECTED) {
                setTimeout(() => {
                    callback(onRejected)
                });
            }
            if (this.PromiseState === PENDING) {
                this.callbacks.push({
                    onResolved: () => { callback(onResolved) },
                    onRejected: () => callback(onRejected)
                })
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    static resolve(result) {
        return new Promise((resolve, reject) => {
            if (result instanceof Promise) {
                result.then(
                    res => resolve(res),
                    err => reject(err)
                )
            } else {
                resolve(result)
            }
        })
    }

    static reject(result) {
        return new Promise((resolve, reject) => {
            reject(result)
        })
    }

    static all(promises) {
        let result = []
        count = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(
                    res => {
                        result[i] = res;
                        count++;
                        if (count === promises.length) {
                            resolve(result)
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            }
        })
    }

    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(
                    res => resolve(res),
                    reason => reject(reason)
                )
            }
        })
    }
}