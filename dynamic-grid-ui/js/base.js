let active = 'active';
let inactive = 'inactive';

function activate(ele) {
    ele.classList.add(active);
    ele.classList.remove(inactive);
}

function deactivate(ele) {
    ele.classList.add(inactive);
    ele.classList.remove(active);
}

let lineClass = 'icon-l-';
let solidClass = 'icon-s-';

function solidate(ele) {
    let addClass, removeClass;
    for (let i = 0; i < ele.classList.length; i++) {
        if (ele.classList[i].startsWith(lineClass)) {
            removeClass = ele.classList[i];
            addClass = ele.classList[i].replace(lineClass, solidClass);
            break;
        }
    }
    ele.classList.add(addClass);
    ele.classList.remove(removeClass);
}

function linate(ele) {
    let addClass, removeClass;
    for (let i = 0; i < ele.classList.length; i++) {
        if (ele.classList[i].startsWith(solidClass)) {
            removeClass = ele.classList[i];
            addClass = ele.classList[i].replace(solidClass, lineClass);
            break;
        }
    }
    ele.classList.add(addClass);
    ele.classList.remove(removeClass);
}

function toggle(ele) {
    if (ele.classList.contains('active')) {
        deactivate(ele);
    } else {
        activate(ele);
    }
}

function ensureCoverInactive(ele) {
    let cover = ele.getElementsByClassName('cover')[0];
    deactivate(cover);
}

function stringToHtml(s) {
    let tmp = document.createElement('div');
    tmp.innerHTML = s;
    return tmp.firstElementChild;
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

let last_randoms = [-1, -1];

function get_random_int(max) {
    // 0 ... max-1
    let rand = Math.floor(Math.random() * max);
    if (max <= 3)
        return rand;
    while (rand === last_randoms[0] || rand === last_randoms[1]) {
        rand = Math.floor(Math.random() * max);
    }
    last_randoms[0] = last_randoms[1];
    last_randoms[1] = rand;
    return rand;
}

function get_random_image() {
    // return `https://unsplash.6-79.cn/random/small?r=${Math.random()}`;
    return `assets/img/${get_random_int(10)}.jpeg`;
}

class RType {
    static staticConstructor() {
        this.MUSIC = 3;
        this.ARTICLE = 2;
    }
}

RType.staticConstructor();
