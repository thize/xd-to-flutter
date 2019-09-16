function inkWell(node, widget) {
  if (node.name.substring(0, 2) == "b_") {
    widget = `new InkWell(
          onTap: (){
            print("onTap ${node.name}");
          },
          child: ${widget},
        )`;
  }
  return widget;
}

function rotation(node, widget) {
  let rotate = node.rotation;
  if (rotate >= 0.1) {
    return `
    Transform.rotate(
      angle: ${rotate.toFixed(2)} * pi / 180,
      child: ${widget},
    )`;
  }
  return widget;
}

module.exports = { inkWell, rotation };