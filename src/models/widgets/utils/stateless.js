function fixName(value) {
  return value.replace(/\s+/g, '').replace("–", "");
}

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