var withSimpleCode = require("../main");

function sz(value) {
  if (withSimpleCode.withSimpleCode && value > 0) {
    return `sz(${fixDouble(value)})`;
  }
  return `${fixDouble(value)}`;
}

function fixDouble(value) {
  try {
    return parseFloat(value.toFixed(2));
  } catch (e) {
    return parseFloat((parseFloat(value)).toFixed(2));
  }
}

function fixName(value) {
  return value.replace(/\s+/g, '').replace("–", "");
}

function statelessWidget(widgetName, child) {
  return `
    class ${widgetName} extends StatelessWidget {
        const ${widgetName}({Key key}) : super(key: key);      
        @override
        Widget build(BuildContext context) {
          return ${child};
        }
      }`;
}

module.exports = { sz, statelessWidget, fixName, fixDouble };