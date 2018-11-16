class Rect {
    constructor(width, height) {
        this.w = width;
        this.h = height;
    }
}

class MultiLevelButton {
    static staticConstructor() {
        this.btnTemplate = template`
            <div class="btn btn-l-${0}">
                <div class="btn-name">${1}</div>
                ${2}
            </div>
        `;
    }

    generateHtml(btnTree, level) {
        let html = '';
        btnTree.forEach((btn) => {
            let son_html = '';
            let btn_name_str = btn.name;

            if (btn.son_list && btn.son_list.length > 0) {
                son_html = this.generateHtml(btn.son_list, level + 1);
            }
            if (btn.icon) {
                btn_name_str += `<span class="${btn.icon}"></span>`
            }
            html +=
                MultiLevelButton.btnTemplate(
                    level,
                    btn_name_str,
                    son_html === '' ? '' : `<div class="btn-son-list inactive">${son_html}</div>`,
                )
        });
        return html;
    }

    constructor({
        multiLevelBtnTree,
        btnBox,
    }) {
        btnBox.innerHTML = this.generateHtml(multiLevelBtnTree, 1);
    }
}

MultiLevelButton.staticConstructor();


class SmartGrid {
    static staticConstructor() {
        this.grids = [
            new Rect(1, 1),
            new Rect(1, 2),
            new Rect(2, 1),
            new Rect(3, 1),
            new Rect(2, 2),
        ];
        this.UNSET = undefined;
        this.NCOLOR = 16;
        this.baseGridSize = 250;
        this.gridTemplate = template`
            <div class="smart-grid grid-${0}x${1} t-${5}" onmouseout="ensureCoverInactive(this)">
                <div class="full bg-c-${2}"></div>
                <div class="cover inactive img-fit" style="background-image: url('${3}');" onclick="toggle(this)"></div>
                <div class="content">${4}</div>
            </div>
        `;
        this.musicTemplate = template`
            <div class="author-rname">${0}</div>
            <div class="buttons">
                <span class="icon icon-l-like" onmouseover="solidate(this)" onmouseout="linate(this)"></span>
                <span class="icon icon-l-play" onmouseover="solidate(this)" onmouseout="linate(this)"></span>
                <span class="icon icon-l-share" onmouseover="solidate(this)" onmouseout="linate(this)"></span>
            </div>
        `;
        this.articleTemplate = template`
            <div class="foot">
                <div class="author">${0}</div>
                <div class="rname">${1}</div>
            </div>
        `;
    }

    static getMap(rect) {
        let map = [];
        for (let i = 0; i < rect.h; i++)
            map[i] = [];
        return map;
    }

    setRandomGrid(top, left) {
        let possible = [], posNum = 0;
        SmartGrid.grids.forEach((grid, index) => {
            if (top + grid.h > this.gridRect.h) {
                possible[index] = 0;
                return;
            }
            for (let i = 0; i < grid.h; i++) {
                for (let j = 0; j < grid.w; j++) {
                    if (this.gridMap[i + top][j + left] !== SmartGrid.UNSET) {
                        possible[index] = 0;
                        return;
                    }
                }
            }
            possible[index] = 1;
            posNum ++;
        });

        let randIndex = get_random_int(posNum);
        let gridIndex;

        for (let i = 0; i < possible.length; i++) {
            if (possible[i] === 1) {
                if (randIndex === 0) {
                    gridIndex = i;
                    break;
                }
                randIndex --;
            }
        }

        for (let i = 0; i < SmartGrid.grids[gridIndex].h; i++) {
            for (let j = 0; j < SmartGrid.grids[gridIndex].w; j++) {
                this.gridMap[i + top][j + left] = gridIndex;
            }
        }

        return gridIndex;
    }

    arrangeGrids() {
        let contentLength = this.contentList.length;
        this.arrangedGridList = [];
        for (let j = 0, contentIndex = 0; contentIndex < contentLength; j++) {
            for (let i = 0; i < this.gridRect.h; i++) {
                if (this.gridMap[i][j] === SmartGrid.UNSET) {
                    if (contentIndex >= contentLength)
                        break;
                    let index = this.setRandomGrid(i, j);
                    this.arrangedGridList.push({
                        gridIndex: index,
                        pos: new Rect(j, i),
                        color: get_random_int(SmartGrid.NCOLOR),
                        contentIndex: contentIndex++,
                    });
                }
            }
        }
    }

    static setElementSize(ele, r) {
        ele.style.height = r.h * SmartGrid.baseGridSize + 'px';
        ele.style.width = r.w * SmartGrid.baseGridSize + 'px';
    }

    static setElementPos(ele, r) {
        ele.style.top = r.h * SmartGrid.baseGridSize + 'px';
        ele.style.left = r.w * SmartGrid.baseGridSize + 'px';
    }

    initGridContainer({
        contentList,
    }) {
        this.contentList = contentList;
        this.arrangeGrids();

        SmartGrid.setElementSize(this.gridContainer, this.gridRect);
        this.arrangedGridList.forEach((item) => {
            let type_html = '';
            let type_class = '';
            let content = contentList[item.contentIndex];
            // console.log(item);
            // console.log(content);
            if (content.sub_type === RType.MUSIC) {
                type_html = SmartGrid.musicTemplate(
                    `${content.author} - ${content.rname}`
                );
                type_class = 'music';
            } else if (content.sub_type === RType.ARTICLE) {
                type_html = SmartGrid.articleTemplate(
                    content.author,
                    content.rname,
                );
                type_class = 'article';
            }
            let html = stringToHtml(
                SmartGrid.gridTemplate(
                    SmartGrid.grids[item.gridIndex].w,
                    SmartGrid.grids[item.gridIndex].h,
                    item.color,
                    get_random_image(),
                    type_html,
                    type_class,
                )
            );
            let child = this.gridContainer.appendChild(html);
            SmartGrid.setElementPos(child, item.pos);
        });
    }

    constructor({
        gridRect,
        gridContainerId,
    }) {
        this.gridRect = gridRect;
        this.gridMap = SmartGrid.getMap(gridRect);
        this.gridContainer = document.getElementById(gridContainerId);
    }
}

SmartGrid.staticConstructor();
