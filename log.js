function logTree(no, dist) {  
    var start = "";
    for (var i = 0; i < dist; i++) {
        start += "|  ";
    }
    if (dist == 0)
        console.log("\nStructure:");
    console.log(`${start}${no.type} - ${no.id}`);
    no.children.forEach(function (f) {
        logTree(f, dist + 1);
    });
}
module.exports = { logTree };