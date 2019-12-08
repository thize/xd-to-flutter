function attWidgetInfo(no) {
    if (no.widget.id == "-1") {
        let newInfo = _newWidgetInfo(no.children);
        no.widget.x = newInfo[0];
        no.widget.y = newInfo[1];
        no.widget.w = newInfo[2];
        no.widget.h = newInfo[3];
    }
    if (no.father != null) {
        attWidgetInfo(no.father);
    }
    return no;
}

function _newWidgetInfo(nos) {
    let x = -1, y = -1, w = -1, h = -1;
    nos.forEach(function (f) {
        if (x == -1) {
            x = f.widget.x;
            y = f.widget.y;
            w = x + f.widget.w;
            h = y + f.widget.h;
        } else {
            x = Math.min(x, f.widget.x);
            y = Math.min(y, f.widget.y);
            w = Math.max(w, f.widget.x + f.widget.w);
            h = Math.max(h, f.widget.y + f.widget.h);
        }
    });
    return [x, y, w - x, h - y];
}

module.exports = { attWidgetInfo };