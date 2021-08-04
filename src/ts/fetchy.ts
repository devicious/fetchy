/*
* Fetchy Library
* Created from Ivan Sollima 03/08/2021
*
*
* */


import * as MD5 from 'crypto-js/md5';

interface FetchyConfig {
    url: string,
    method: string,
    headers?: Headers,
    data?: any,
    timeout: number,
    retry: number,
    delay?: number,
    format: string,
    credentials?: RequestCredentials,
    mode?: RequestMode,
    cache?: boolean,
    id?: string,
    expiry?: number,
    _cacheUID: string,
    _cacheQueueUID: string
    _cacheQueueRetries: number

}

/**
 * ### The *Fetchy* class comes as an helper that represent a configurable link to a remote resource.
 *
 * Any instance can be configured in many different aspects while enforcing correct configuration for every specific case. <br>
 * Leveraging this model you can obtain pre-configured instances from where you can fetch as many times as you want with automatic error handling, caching, timeouts, etc.
 *
 * @constructor {class} You must use the new keyword to instantiate Fetchy
 * @param {string} url - This parameter is required
 * @returns a new instance of Fetchy class
 */
class Fetchy {

    /**
     * This variable represents the internal state of a Fetchy instance.
     * It mutates while you configure your instance, and it's inherited from its child.
     *
     * @category Internal Configuration
     */
    private config: FetchyConfig = {
        url: '',
        timeout: 10000,
        retry: 0,
        format: "json",
        method: 'GET',
        _cacheUID: "_cacheResponseData",
        _cacheQueueUID: "_cacheResponseQueue",
        _cacheQueueRetries: 40
    };

    /**
     * This variable handles the internal caching storage.
     *
     * @category Internal
     */
    private cacheStorage = {};

    /**
     * The properties of a Fetchy instance are mutable up until the first fetch. <br>
     * From that moment only the payload data can be mutated, in order to prevent consistency issues.
     *
     * @category Internal
     */
    private writable = true;

    constructor(url: string) {

        this.config = {
            url,
            method: 'GET',
            headers: new Headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            timeout: 30000,
            retry: 0,
            delay: 0,
            format: "json",
            credentials: "same-origin",
            mode: 'cors',
            cache: false,
            id: '',
            expiry: 0,
            _cacheUID: "_cacheResponseData",
            _cacheQueueUID: "_cacheResponseQueue",
            _cacheQueueRetries: 40
        }

        this.refreshCacheStorage();

    }


    /**
     * @internal
     */
    private attachSelf(response: any) {
        const source = Object.getPrototypeOf(response);
        Object.setPrototypeOf(source, this);
        return response;
    }

    /**
     * @internal
     */
    private do() {
        this.writable = false;
        const cacheEnabled = this.config.cache

        return this.attachSelf(new Promise((resolve, reject) => {

            if (!cacheEnabled || (cacheEnabled && !this.isCached() && !this.isInQueue())) {

                const {timeout, retry, delay} = this.config;

                const handleTimeout = () => {
                    return new Promise((resolve, reject) => {
                        let timer;
                        if (timeout) {
                            timer = setTimeout(() => {
                                reject("Timeout");
                            }, timeout);
                        }
                        this.call()
                            .then(response => resolve(response))
                            .catch(error => reject(error))
                            .finally(() => {
                                timer && clearTimeout(timer);
                            });
                    })
                };

                const handleRetries = (promise) => {
                    return new Promise((resolve, reject) => {
                        retryHelper(promise, retry);

                        function retryHelper(promise, counter) {
                            promise()
                                .then(data => {
                                    resolve(data);
                                })
                                .catch(err => {
                                    if (counter > 1) {
                                        setTimeout(() => {
                                            retryHelper(promise, --counter);
                                        }, delay);
                                    } else {
                                        reject(err);
                                    }
                                });
                        }
                    });
                }

                handleRetries(handleTimeout)
                    .then(response => {
                        resolve(this.formatResponse(response));
                    })
                    .catch(error => {
                        reject(error)
                    });

                if (cacheEnabled) {
                    this.setQueue();
                }

            } else {
                resolve(this.retrieveCached());
            }

        }).then((response) => {
            if (cacheEnabled && !this.isCached()) {
                this.storeCached(response);
            }
            return response;
        }));
    }

    /**
     * @internal
     */
    private call() {
        const {method, headers, credentials, mode, data} = this.config;

        const body = typeof data !== 'string' ? JSON.stringify(data) : data;

        return fetch(this.config.url, {
            method,
            headers,
            credentials,
            body,
            mode,
        });
    }

    /**
     * @internal
     */
    private formatResponse(metaResponse) {
        if (metaResponse[this.config.format]) {
            return metaResponse[this.config.format]()
                .then((response) => {
                    Object.defineProperty(response, "meta", {
                        value: {
                            ok: metaResponse.ok,
                            status: metaResponse.status,
                            redirected: metaResponse.redirected,
                            statusText: metaResponse.statusText,
                            type: metaResponse.type,
                        },
                        writable: false,
                        enumerable: false,
                    });
                    return response;
                })
        } else {
            throw new Error(
                `${metaResponse.status} - The response format ${this.config.format} is not available on current response.`
            );
        }
    }


    /**
     * Resets the internal state to the default values.
     *
     * @returns the current *Fetchy* instance
     */
    reset() {

        this.override({
            method: 'GET',
            data: undefined,
            headers: new Headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            timeout: 30000,
            retry: 0,
            delay: 0,
            format: "json",
            credentials: "same-origin",
            mode: 'cors',
            token: false,
            cache: false
        })

        return this;
    }

    method(method: string) {
        const allowed_methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];
        if (method && allowed_methods.indexOf(method) >= 0) {
            this.override({
                method,
            })
        } else {
            throw `Method not allowed ${method}`;
        }

        return this;
    }

    headers(headers: any) {
        if (headers) {
            this.override({
                headers: new Headers(headers)
            })
        }

        return this;
    }

    timeout(seconds: number) {
        if (seconds && seconds >= 1) {
            this.override({
                timeout: (seconds * 1000),
            })
        } else {
            throw "Timeout cannot be less than one second."
        }

        return this;
    }

    format(format: string) {
        const allowed_formats = ['json', 'text', 'blob'];
        if (format && allowed_formats.indexOf(format) >= 0) {
            this.override({
                format,
            })
        } else {
            throw `The format you specified ${format} is not valid.`;
        }

        return this;
    }

    retry(times: number, delayMs: number = 0) {
        if (times && times >= 0) {
            this.override({
                retry: times,
                delay: delayMs,
            })
        } else {
            throw "Retries cannot be less than zero."
        }

        return this;
    }

    data(data) {
        const clone = this.clone();
        if (this.config.method !== 'GET') {
            clone.override({
                data
            });
        } else {
            throw 'You cannot specify a body with GET calls.'
        }

        return clone;
    }

    id(id) {
        if (id) {
            this.override({
                id
            });
        } else {
            throw 'ID must be a non empty string value'
        }

        return this;
    }

    credentials(credentials: string) {
        const allowed_credentials = ['omit', 'same-origin', 'include'];
        if (credentials && allowed_credentials.indexOf(credentials) >= 0) {
            this.override({
                credentials,
            })
        } else {
            throw `The credential mode you specified ${credentials} is not valid.`;
        }

        return this;
    }

    mode(mode: string) {
        const allowed_modes = ['cors', 'same-origin', 'no-cors'];
        if (mode && allowed_modes.indexOf(mode) >= 0) {
            this.override({
                mode,
            })
        } else {
            throw `The mode you specified ${mode} is not valid.`;
        }

        return this;
    }

    clone() {
        const url = this.config.url;
        const instance = new Fetchy(url);
        instance.override(this.config);

        return instance;
    }

    override(config) {
        if (this.writable) {
            this.config = {
                ...this.config,
                ...config
            }
        } else {
            throw "Configuration is not editable anymore"
        }
        return this;
    }

    cache(enable: boolean) {
        this.override({
            cache: !!enable
        })

        return this;
    }

    expiry(minutes) {
        if (minutes && minutes >= 1) {
            const now = new Date().getTime();
            this.override({
                expiry: now + (minutes * 60000),
            })
        } else {
            throw "Expiry cannot be less than one minute."
        }

        return this;
    }

    private isCached() {
        this.refreshCacheStorage();
        const hash = this.getCacheHash();
        const item = this.cacheStorage[hash];
        const now = new Date().getTime();
        return !!item && (!item.expiry || item.expiry > now);
    }

    private refreshCacheStorage() {
        this.cacheStorage = JSON.parse(sessionStorage.getItem(this.config._cacheUID) || "{}");
        window[this.config._cacheQueueUID] = window[this.config._cacheQueueUID] || {};
    }

    private retrieveCached() {
        return new Promise((resolve, reject) => {
            this.refreshCacheStorage();
            const hash = this.getCacheHash();
            const item = this.cacheStorage[hash];
            if (item || this.isInQueue()) {
                if (item) {
                    resolve(item.data);
                } else {
                    let tries = 0;
                    const maxTries = this.config._cacheQueueRetries;
                    const handler = this;
                    const interval = setInterval(() => {
                        handler.refreshCacheStorage();
                        const item = handler.cacheStorage[hash];
                        if (item) {
                            resolve(item.data)
                            clearInterval(interval);
                        } else if (tries < maxTries) {
                            tries++;
                        } else {
                            clearInterval(interval);
                            reject("Unexpected timeout error during cache retrieval")
                        }
                    }, 350);
                }
            } else {
                reject("Unexpected error during cache retrieval");
            }
        });
    }

    private storeCached(response) {
        this.refreshCacheStorage();
        const hash = this.getCacheHash();
        this.cacheStorage[hash] = {
            expiry: this.config.expiry,
            data: response,
        };
        sessionStorage.setItem(this.config._cacheUID, JSON.stringify(this.cacheStorage));
        delete window[this.config._cacheQueueUID][hash];

    }

    private getCacheHash() {
        const {
            url,
            method,
            data,
            format,
            credentials,
            mode,
            id,
        } = this.config;

        const preHash = JSON.stringify({
            url,
            method,
            data,
            format,
            credentials,
            mode,
        });

        return `${id}-${MD5(preHash.replace(/[^\w]/gi, '')).toString()}`;
    }

    private setQueue() {
        const hash = this.getCacheHash();
        window[this.config._cacheQueueUID][hash] = true;
    }

    private isInQueue() {
        const hash = this.getCacheHash();
        return !!window[this.config._cacheQueueUID][hash];
    }

    then(fn) {
        return this.do()
            .then(fn)
    }

    catch(fn) {
        return this.do()
            .catch(fn)
    }

    finally(fn) {
        return this.do()
            .finally(fn)
    }

    debug() {
        console.log(this.config);
        return this;
    }

}

const Authors = new Fetchy("https://6102cc7e79ed680017482315.mockapi.io/api/v1/users")
    .method('POST')
    .cache(true)
    .id('articles')
    .expiry(1)

let result =
    Authors
        .data({
            abc: '12312',
            cdd: '123123'
        })
        .then((data) => {
            console.log('1', data);
        });


let result2 =
    Authors
        .data({
            abc: '12312',
            cdd: '123123'
        })
        .then((data) => {
            console.log('2', data);
        });
