const scenegraph = require("scenegraph");
const { AppIcon } = require("./models/app_icon");
const fs = require("uxp").storage.localFileSystem;

async function exportAppIcon(platform) {
    const item = scenegraph.selection.items[0];
    if (item == null) return showDialog("Select something", true);
    if (item.localBounds.width != 1024 || item.localBounds.height != 1024) return showDialog("Selected object is not 1024x1024.", true);
    const flutterProjectFolder = await fs.getFolder();
    if (!flutterProjectFolder) return;
    new AppIcon(item, flutterProjectFolder).export(platform);
}

module.exports = {
    exportAppIcon: exportAppIcon,
};
