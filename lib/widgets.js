var textWidgetGenerator = function (tagname) {
    return function () {
        var output = ["<", tagname],
            i;

        for (i in this) {
            if (this.hasOwnProperty(i) && i !== "content" && 1 !== "tagname") {
                output.push(" ", i, "='", this[i], "'");
            }
        }

        output.push(">", this.content, "</", tagname, ">");
        return output.join("");
    };
};

/**
* Renders a paragraph. This is fairly simple.
*/
exports.p = textWidgetGenerator("p");
/**
* Renders a paragraph. This is fairly simple.
*/
exports.h1 = textWidgetGenerator("h1");

/**
* Renders a paragraph. This is fairly simple.
*/
exports.h2 = textWidgetGenerator("h2");

/**
* Renders a paragraph. This is fairly simple.
*/
exports.h3 = textWidgetGenerator("h3");

/**
* Renders an oredered list. This is fairly simple.
*/
exports.ol = textWidgetGenerator("ol");

/**
* Renders an unoredered list. This is fairly simple.
*/
exports.ul = textWidgetGenerator("ul");

/**
* Renders a blockquote. This is fairly simple.
*/
exports.q = textWidgetGenerator("q");

/**
* Renders a simple composite widget.
*/
exports.list = exports.image = function (context) {
    var output = ["<div"],
        i;

    for (i in this) {
        if (this.hasOwnProperty(i) && i !== "content" && 1 !== "tagname") {
            output.push(" ", i, "='", this[i], "'");
        }
    }

    output.push(" data-tagname='", this.tagname, "'");
    output.push(">", this.content, "</div>");

    return output.join("");
};

/**
* This helper renders a slot independently from a template.
*/
exports.renderSlot = function (slotContent, context) {
    var slot = slotContent || [],
        output = [],
        widget,
        i = 0,
        j = slot.length;

    for (i, j; i < j; i += 1) {
        widget = slot[i];
        if (widget === undefined || widget === null || widget === false) {
            continue;
        }

        if (typeof widget === 'string') {
            output.push(widget);
        } else if (widget.tagname && typeof exports[widget.tagname] === "function") {
            output.push(exports[widget.tagname].call(widget, context));
        }
    }

    return output.join("");
};
