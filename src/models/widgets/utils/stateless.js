
function statelessWidget(node, child) {
  return `
      class ${fixName(node.name)} extends StatelessWidget {
          const ${fixName(node.name)}({Key key}) : super(key: key);    
          
          @override
          Widget build(BuildContext context) {
            return ${child};
          }
        }`;
}

module.exports = {
  statelessWidget: statelessWidget,
};

function fixName(value) {
  console.log('value = ' + value);
  value = value.trim();
  console.log('value = ' + value);
  let parts = [];
  do {
    let indexOf = value.indexOf(' ');
    if (indexOf == -1) {
      indexOf = value.length;
    }
    parts.push(value.substr(0, indexOf));
    value = value.substr(indexOf + 1, value.length);
  } while (value.length > 0);
  parts.forEach(part => {
    part = part.toLowerCase();
    part = part[0].toUpperCase() + part.substr(1, part.length);
    value = value + part;
  });
  return value.replace('–', '');
}
