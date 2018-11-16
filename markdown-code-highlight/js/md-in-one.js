class MarkdownHandler {
    static staticConstructor() {
        this.convertor = new showdown.Converter({
            tables: true,
        });
    }

    constructor({
        markdownAreaId,
        markdownText,
    }) {
        this.markdownArea = document.getElementById(markdownAreaId);
        this.markdownArea.innerHTML = MarkdownHandler.convertor.makeHtml(markdownText);
    }
}

MarkdownHandler.staticConstructor();
