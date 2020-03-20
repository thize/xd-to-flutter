function updateWidgetInfo(no) {
    if (no.widget.id == "-1") {
        let newInfo = _newWidgetInfo(no.children);
        no.widget.x = newInfo[0];
        no.widget.y = newInfo[1];
        no.widget.w = newInfo[2];
        no.widget.h = newInfo[3];
        no.widget.gw = newInfo[4];
        no.widget.gh = newInfo[5];
    }
    if (no.father != null) {
        updateWidgetInfo(no.father);
    }
    return no;
}

function _newWidgetInfo(nos) {
    let x = -1, y = -1, w = -1, h = -1, gw = -1, gh = -1;
    nos.forEach(function (f) {
        if (x == -1) {
            x = f.widget.x;
            y = f.widget.y;
            w = x + f.widget.w;
            h = y + f.widget.h;
            gw = x + f.widget.gw;
            gh = y + f.widget.gh;
        } else {
            x = Math.min(x, f.widget.x);
            y = Math.min(y, f.widget.y);
            w = Math.max(w, f.widget.x + f.widget.w);
            h = Math.max(h, f.widget.y + f.widget.h);
            gw = Math.max(w, f.widget.x + f.widget.gw);
            gh = Math.max(h, f.widget.y + f.widget.gh);
        }
    });
    return [x, y, w - x, h - y, gw - x, gh - y];
}

module.exports = { updateWidgetInfo };