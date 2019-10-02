function widgetSvg(node) {
  return `SvgPicture.asset(
        'assets/svg/${node.name}.svg',
        height: sz(${node.boundsInParent["height"]}),
        width: sz(${node.boundsInParent["width"]}),
      )`;
}

module.exports = { widgetSvg };