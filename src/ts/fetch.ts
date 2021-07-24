interface FetchConfig {
    url: String,
    method: String,
    headers?: Headers,
    timeout?: Number,
    retries?: Number,
    format?: String,
    credentials?: String,
    mode?: String,
    token?: Boolean,
    cache?: Boolean
}
class Fetch {

    config: FetchConfig = {
        url: '',
        method: 'GET'
    };

    constructor (url) {

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

    method (method: string) {
        const allowed_methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];
        if(method && allowed_methods.indexOf(method) >= 0) {
            this.config = {
                ...this.config,
                method,
            }
        } else {
            throw `Method not allowed ${method}`;
        }

        return this;
    }

    headers (headers: any) {
        if(headers) {
            this.config = {
                ...this.config,
                headers: new Headers(headers)
            }
        }

        return this;
    }

    debug() {
        console.log(this.config);
        return this;
    }

}

const ABC = new Fetch("/test");

ABC
.method('PUT')
.debug()
.method('POST')
.debug();