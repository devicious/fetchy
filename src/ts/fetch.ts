interface FetchyConfig {
    url: String,
    method: String,
    headers?: Headers,
    data?: any,
    timeout?: Number,
    retries?: Number,
    format?: String,
    credentials?: String,
    mode?: String,
    token?: Boolean,
    cache?: Boolean
}

class Fetchy {

    config: FetchyConfig = {
        url: '',
        method: 'GET'
    };

    constructor(url) {

        this.config = {
            url,
            method: 'GET',
            headers: new Headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            timeout: 30000,
            retries: 0,
            format: "json",
            credentials: "same-origin",
            mode: 'cors',
            token: false,
            cache: false
        }
    }

    reset() {
        this.config = {
            ...this.config,
            method: 'GET',
            data: undefined,
            headers: new Headers({
                Accept: "application/json",
                "Content-Type": "application/json"
            }),
            timeout: 30000,
            retries: 0,
            format: "json",
            credentials: "same-origin",
            mode: 'cors',
            token: false,
            cache: false
        }

        return this;
    }

    method(method: string) {
        const allowed_methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];
        if (method && allowed_methods.indexOf(method) >= 0) {
            this.config = {
                ...this.config,
                method,
            }
        } else {
            throw `Method not allowed ${method}`;
        }

        return this;
    }

    headers(headers: any) {
        if (headers) {
            this.config = {
                ...this.config,
                headers: new Headers(headers)
            }
        }

        return this;
    }

    timeout(timeout: Number) {
        if(timeout && timeout > 1000) {
            this.config = {
                ...this.config,
                timeout,
            }
        } else {
            throw "Timeout cannot be less than one second."
        }

        return this;
    }

    format(format: string) {
        const allowed_formats = ['json', 'text', 'blob'];
        if(format && allowed_formats.indexOf(format) >= 0) {
            this.config = {
                ...this.config,
                format,
            }
        } else {
            throw `The format you specified ${format} is not valid.`;
        }

        return this;
    }

    retries(retries: Number) {
        if(retries && retries >= 0) {
            this.config = {
                ...this.config,
                retries,
            }
        } else {
            throw "Retries cannot be less than zero."
        }

        return this;
    }

    credentials(credentials: string) {
        const allowed_credentials = ['omit', 'same-origin', 'include'];
        if(credentials && allowed_credentials.indexOf(credentials) >= 0) {
            this.config = {
                ...this.config,
                credentials,
            }
        } else {
            throw `The credential mode you specified ${credentials} is not valid.`;
        }

        return this;
    }

    mode(mode: string) {
        const allowed_modes = ['cors', 'same-origin', 'no-cors'];
        if(mode && allowed_modes.indexOf(mode) >= 0) {
            this.config = {
                ...this.config,
                mode,
            }
        } else {
            throw `The mode you specified ${mode} is not valid.`;
        }

        return this;
    }

    token (enable: Boolean) {
        this.config = {
            ...this.config,
            token: !!enable
        }
    }

    cache (enable: Boolean) {
        this.config = {
            ...this.config,
            cache: !!enable
        }
    }

    debug() {
        console.log(this.config);
        return this;
    }

}

const Fetch = new Fetchy("/test");

Fetch
    .method('PUT')
    .debug()
    .method('POST')
    .debug();