const { xdAlignmentToDartAlignment } = require("./xd_alignment_to_dart_alignment");

function getAlignmentByFather(node, fatherNode, onlyTag) {
    const top = node.bounds.y1 - fatherNode.bounds.y1;
    const right = fatherNode.bounds.x2 - node.bounds.x2;
    const bot = fatherNode.bounds.y2 - node.bounds.y2;
    const left = node.bounds.x1 - fatherNode.bounds.x1;
    let auxBot = bot == 0 && top == 0 ? 1 : bot;
    const alignY = (top / (top + auxBot));
    let auxRight = right == 0 && left == 0 ? 1 : right;
    const alignX = (left / (left + auxRight));
    const resAlignment = xdAlignmentToDartAlignment(alignX, alignY);
    if (resAlignment == 'Alignment.center') {
        if (onlyTag) return `alignment: ${resAlignment},`;
        return `Center(child: ${node.toDart()},)`;
    }
    if (resAlignment != 'Alignment.topLeft') {
        if (onlyTag) return `alignment: ${resAlignment},`;
        return `Align(alignment: ${resAlignment}, child: ${node.toDart()},)`;
    }
    if (onlyTag) return '';
    return node.toDart();
}

exports.getAlignmentByFather = getAlignmentByFather;