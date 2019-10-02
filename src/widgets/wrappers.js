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

module.exports = { rotation };