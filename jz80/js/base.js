let active = 'active';
let inactive = 'inactive';
let alipay = 'alipay';
let weixin = 'weixin';

function addCLass(ele, cls) {
    ele.classList.add(cls);
}

function removeClass(ele, cls) {
    ele.classList.remove(cls);
}

function replaceClass(ele, be, tobe) {
    removeClass(ele, be);
    addCLass(ele, tobe);
}

function activate(ele) {
    ele.classList.add(active);
    ele.classList.remove(inactive);
}

function deactivate(ele) {
    ele.classList.add(inactive);
    ele.classList.remove(active);
}

class Method {
    static staticConstructor() {
        this.GET = 'get';
        this.POST = 'post';
        this.PUT = 'put';
        this.DELETE = 'delete';
    }
}

class ErrorHandler {
    static handler(error) {
        return Promise.reject(error);
    }
}

class Request {
    static staticConstructor() {
        this.token = window.localStorage.getItem('token');
    }
    static saveToken(token) {
        this.token = token;
        window.localStorage.setItem('token', token);
    }
    static removeToken() {
        window.localStorage.removeItem('token');
    }
    static getQueryString(params) {
        const esc = encodeURIComponent;
        return Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
    }
    static async baseFetch(method, url, data=null, credential=true, json=true) {
        // url = this.worldAPIHost + url;
        if ((method === Method.GET || method === Method.DELETE) && data) {
            url += '?' + this.getQueryString(data);
            data = null;
        }
        let credentials = credential ? "include" : 'omit';
        let req;
        if (json) {
            req = await fetch(url, {
                method: method,
                headers: {
                    "Content-type": "application/json",
                    "Token": this.token || '',
                },
                body: data ? JSON.stringify(data) : null,
                credentials: credentials,
            });
        } else {
            req = await fetch(url, {
                method: method,
                body: data,
                credentials: credentials,
            });
        }
        return req.json().then((resp) => {
            if (resp.code !== 0) {
            InfoCenter.push(new Info(resp.msg, Info.TYPE_ERROR));
            return ErrorHandler.handler(resp);
        }
        return resp.body;
    }).catch(ErrorHandler.handler);
    }
    static async get(url, data=null, credential=true, json=true) {
        return this.baseFetch(Method.GET, url, data, credential, json);
    }
    static async post(url, data=null, credential=true, json=true) {
        return this.baseFetch(Method.POST, url, data, credential, json);
    }
    static async put(url, data=null, credential=true, json=true) {
        return this.baseFetch(Method.PUT, url, data, credential, json);
    }
    static async delete(url, data=null, credential=true, json=true) {
        return this.baseFetch(Method.DELETE, url, data, credential, json);
    }
}

// new Request().get('/api/user/@root');

function get_random_string() {
    return Math.random().toString(36).substr(2, 5);
}

function template(strings, ...keys) {
    return (function (...values) {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach(function (key, i) {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

function stringToHtml(s) {
    let tmp = document.createElement('div');
    tmp.innerHTML = s;
    return tmp.firstElementChild;
}

function getQueryParam(key) {
    let params = new URLSearchParams(window.location.search);
    if (params.has(key))
        return params.get(key);
}

Method.staticConstructor();
Request.staticConstructor();

document.addEventListener('keydown', function ($event) {
    if ($event.keyCode === 9) {
        return $event.preventDefault();
    }
});
