const PROMISE_PENDING_STATE = 'pending'
const PROMISE_FULFIELD_STATE = 'fulfilled'
const PROMISE_REJECTED_STATE = 'rejected'

class PromiseOwn {
    constructor(execute) {
        this.PromiseState = PROMISE_PENDING_STATE
        this.PromiseResult = undefined
        this.callbacks = []

        try {
            execute(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }

    resolve(result) {
        if (this.PromiseState === PROMISE_PENDING_STATE) {
            this.PromiseState = PROMISE_FULFIELD_STATE
            this.PromiseResult = result

            setTimeout(() => {
                this.callbacks.forEach(cb => {
                    cb.onResolved(this.PromiseResult)
                })
            });
        }
    }

    reject(reason) {
        if (this.PromiseState === PROMISE_PENDING_STATE) {
            this.PromiseState = PROMISE_REJECTED_STATE
            this.PromiseResult = reason

            setTimeout(() => {
                this.callbacks.forEach(cb => {
                    cb.onRejected(this.PromiseResult)
                })
            });
        }
    }

    then(onResolved, onRejected) {
        if (typeof onResolved != 'function') {
            onResolved = (result) => {
                return result
            }
        }
        if (typeof onRejected != 'function') {
            onRejected = (reason) => {
                throw reason
            }
        }
        return new PromiseOwn((resolve, reject) => {
            const callback = (fn) => {
                try {
                    const result = fn(this.PromiseResult)
                    if (result instanceof PromiseOwn) {
                        result.then((res) => { resolve(res) }, (error) => reject(error))
                    } else {
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            // waiting
            if (this.PromiseState === PROMISE_PENDING_STATE) {
                this.callbacks.push({
                    onResolved: () => { callback(onResolved) },
                    onRejected: () => { callback(onRejected) }
                })
            }
            // success
            if (this.PromiseState === PROMISE_FULFIELD_STATE) {
                setTimeout(() => {
                    callback(onResolved)
                });
            }

            // failed
            if (this.PromiseState === PROMISE_REJECTED_STATE) {
                setTimeout(() => {
                    callback(onRejected)
                });
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    static resolve(result) {
        return new PromiseOwn((resolve, reject) => {
            if (result instanceof PromiseOwn) {
                result.then(
                    (res) => {
                        resolve(res)
                    },
                    (error) => {
                        reject(error)
                    }
                )
            } else {
                resolve(result)
            }
        })
    }

    static reject(reason) {
        return new PromiseOwn((resolve, reject) => {
            reject(reason)
        })
    }

    static all(promises) {
        let result = []
        let count = 0
        return new PromiseOwn((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(
                    (res) => {
                        result[i] = res
                        count++
                        if (count === promises.length) {
                            resolve(result)
                        }
                    },
                    (reason) => {
                        reject(reason)
                    }
                )
            }
        })
    }

    static race(promises) {
        return new PromiseOwn((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(
                    (res) => { resolve(res) },
                    (reason) => { reject(reason) }
                )
            }
        })
    }
}