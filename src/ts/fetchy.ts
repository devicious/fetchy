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

    /**
     * Allows to set a method for the fetch call.
     *
     * @param {string} method - Allowed values: 'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'
     * @returns the Fetchy class instance
     */
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

    /**
     * Allows to set headers for the fetch call.
     *
     * @param {any} headers - Allowed values Array, Object
     * @returns the Fetchy class instance
     */
    headers(headers: any) {
        if (headers) {
            this.override({
                headers: new Headers(headers)
            })
        }

        return this;
    }

    /**
     * Allows to set fetch timeout in seconds.
     *
     * @param {number} seconds - Must be a value equal or greater than 1
     * @returns the Fetchy class instance
     */
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

    /**
     * Allows to set fetch expected response format
     *
     * @param {string} format - Allowed values: 'json', 'text', 'blob'
     * @returns the Fetchy class instance
     */
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

    /**
     * Allows to set automatic retries in case of fetch failure.
     *
     * @param {number} times - Number of times to retry before considering failed the request
     * @param {number} delayMs - Time to wait between each try, expressed in ms.
     * @returns the Fetchy class instance
     */
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

    /**
     * Allows to set request payload.
     *
     * @param {any} data - Allowed formats: Object, Array, String.
     * @returns *a new clone* of Fetchy class instance that inherits all previous configurations.
     */
    data(data: any) {
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

    /**
     * Sets a unique id for the current Fetch instance, allowing more clear and debug friendly caching
     *
     * @param {string} id - Allowed values: Any unique string
     * @returns the Fetchy class instance
     */
    id(id: string) {
        if (id) {
            this.override({
                id
            });
        } else {
            throw 'ID must be a non empty string value'
        }

        return this;
    }

    /**
     * Sets the credential mode for the current Fetch instance.
     *
     * @param {string} credentials - Allowed values: 'omit', 'same-origin', 'include'
     * @returns the Fetchy class instance
     */
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

    /**
     * Sets a mode for the current Fetch instance to handle CORS issues
     *
     * @param {string} mode - 'cors', 'same-origin', 'no-cors'
     * @returns the Fetchy class instance
     */
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

    /**
     * Clones the current instance into a new one, allowing for configuration changes without affecting the original instance.
     *
     * @returns *a new clone* of Fetchy class instance that inherits all previous configurations.
     */
    clone() {
        const url = this.config.url;
        const instance = new Fetchy(url);
        instance.override(this.config);

        return instance;
    }

    /**
     * Override the current configuration of the Fetchy instance without format restrictions, should not be used.
     * @internal
     * @returns *a new clone* of Fetchy class instance that inherits all previous configurations.
     */
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

    /**
     * Enable or disable automatic caching for the current Fetchy instance. <br>
     * Caching is performed automatically when enabled based on the current set of parameters, and automatically handling configuration changes. <br>
     * Any change in the configuration or data payload will generate new calls instead of fetching from the cache.
     *
     * @param {boolean} enable - true | false
     * @returns the Fetchy class instance
     */
    cache(enable: boolean) {
        this.override({
            cache: !!enable
        })

        return this;
    }

    /**
     * Sets a time in minutes after which any cached request will be discarded and substituted with a fresh data fetch.
     *
     * @param {number} minutes - Timing expressed in minutes
     * @returns the Fetchy class instance
     */
    expiry(minutes: number) {
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

    /**
     * @internal
     */
    private isCached() {
        this.refreshCacheStorage();
        const hash = this.getCacheHash();
        const item = this.cacheStorage[hash];
        const now = new Date().getTime();
        return !!item && (!item.expiry || item.expiry > now);
    }

    /**
     * @internal
     */
    private refreshCacheStorage() {
        this.cacheStorage = JSON.parse(sessionStorage.getItem(this.config._cacheUID) || "{}");
        window[this.config._cacheQueueUID] = window[this.config._cacheQueueUID] || {};
    }

    /**
     * @internal
     */
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

    /**
     * @internal
     */
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

    /**
     * @internal
     */
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

    /**
     * @internal
     */
    private setQueue() {
        const hash = this.getCacheHash();
        window[this.config._cacheQueueUID][hash] = true;
    }

    /**
     * @internal
     */
    private isInQueue() {
        const hash = this.getCacheHash();
        return !!window[this.config._cacheQueueUID][hash];
    }

    /**
     * Triggers the data fetch and returns the final payload. <br>
     * After this method is invoked is no longer possible to change this instance configuration without cloning it.
     *
     * @param {Function} fn - A callback function that is invoked with the result of the fetch in case of success
     * @returns *a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.
     */
    then(fn: Function) {
        return this.do()
            .then(fn)
    }

    /**
     * Triggers the data fetch and returns the final payload. <br>
     * After this method is invoked is no longer possible to change this instance configuration without cloning it.
     *
     * @param {Function} fn - A callback function that is invoked with the result of the fetch in case of error
     * @returns *a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.
     */
    catch(fn: Function) {
        return this.do()
            .catch(fn)
    }

    /**
     * Triggers the data fetch and returns the final payload. <br>
     * After this method is invoked is no longer possible to change this instance configuration without cloning it.
     *
     * @param {Function} fn - A callback function that is invoked with the result of the fetch in either case
     * @returns *a mutated version* of Fetchy class instance that inherits all the properties of a *Promise*.
     */
    finally(fn: Function) {
        return this.do()
            .finally(fn)
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

