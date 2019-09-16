function widgetSvg(node) {
  return `SvgPicture.asset(
        'assets/svg/${node.name}.svg',
        height: sz(${node.boundsInParent["height"]}),
        width: sz(${node.boundsInParent["width"]}),
        alignment: Alignment.center,
      )`;
}

module.exports = { widgetSvg };