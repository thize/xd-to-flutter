const { widgetPrefix } = require("../functions/util/util");

function statelessWidget(name, child) {
  name = widgetPrefix() + name;
  return `
      class ${name} extends StatelessWidget {
          const ${name}({Key key}) : super(key: key);    
          
          @override
          Widget build(BuildContext context) {
            return ${child};
          }
        }`;
}
module.exports = {
  statelessWidget: statelessWidget,
};

function fixClassName(value) {
  value = value.trim();
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
    part = part[0].toUpperCase() + part.substr(1, part.length);
    value = value + part;
  });
  return value.replace('–', '');
}
