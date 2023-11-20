const PROMISE_PENDING_STATE = 'pending'
const PROMISE_FULFILLED_STATE = 'fulfilled'
const PROMISE_REJECTED_STATE = 'rejected'

class RewritePromise {
    constructor(excute) {
        this.PromiseState = PROMISE_PENDING_STATE
        this.PromiseResult = undefined

        this.callbacks = []

        try {
            excute(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }

    resolve(result) {
        if (this.PromiseState === PROMISE_PENDING_STATE) {
            this.PromiseState = PROMISE_FULFILLED_STATE
            this.PromiseResult = result

            setTimeout(() => {
                this.callbacks.forEach((cb) => {
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
                this.callbacks.forEach((cb) => {
                    cb.onRejected(this.PromiseResult)
                })
            });
        }
    }

    then(onResolved, onRejected) {
        if (typeof onResolved !== "function") {
            onResolved = (result) => {
                return result
            }
        }
        if (typeof onRejected !== "function") {
            onRejected = (reason) => {
                throw reason
            }
        }
        return new RewritePromise((resolve, reject) => {
            const callback = (fn) => {
                try {
                    const result = fn(this.PromiseResult)
                    if (result instanceof PromiseOwn) {
                        result.then(
                            (res) => {
                                resolve(res)
                            },
                            (err) => {
                                reject(err)
                            }
                        )
                    } else {
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            if (this.PromiseState === PROMISE_FULFILLED_STATE) {
                setTimeout(() => {
                    callback(onResolved)
                });
            }

            if (this.PromiseState === PROMISE_REJECTED_STATE) {
                setTimeout(() => {
                    callback(onRejected)
                });
            }

            if (this.PromiseState === PROMISE_PENDING_STATE) {
                this.callbacks.push({
                    onResolved: () => {
                        callback(onResolved)
                    },
                    onRejected: () => {
                        callback(onRejected)
                    }
                })
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
                    (err) => {
                        reject(err)
                    }
                )
            } else {
                resolve(result)
            }
        })
    }

    static reject(result) {
        return new PromiseOwn((resolve, reject) => {
            reject(result)
        })
    }
}