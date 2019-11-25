

function logTree(no, dist) {
  var ant = 0;
  var start = "";
  for (var i = 0; i < dist; i++) {
    start += "|  ";
  }
  if (ant == dist) {
    console.log("\nStructure:");
  }
  console.log(`${start}${no.widget} - ${no.widget.id}, w = ${no.widget.gw}, h = ${no.widget.gh}, x = ${no.widget.x}, y = ${no.widget.y}`);
  no.children.forEach(function (f) {
    logTree(f, dist + 1);
  });
}

function logCode(code) {
  console.log(`\nCode:\n${code}`);
}
module.exports = { logCode, logTree };