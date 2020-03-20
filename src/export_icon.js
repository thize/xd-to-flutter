const scenegraph = require("scenegraph");
const application = require("application");
const fs = require("uxp").storage.localFileSystem;

async function exportIcon(platform) {
    const item = scenegraph.selection.items[0];
    if (item == null) return showDialog("Select something", true);
    if (item.localBounds.width != 1024 || item.localBounds.height != 1024) return showDialog("Selected object is not 1024x1024.", true);
    const folder = await fs.getFolder();
    if (!folder) return showDialog("Folder", true);
    let renditions = [];
    if (platform == 'ios') {
        renditions = await createIosRenditions(folder, item);
    } else if (platform == 'android') {
        renditions = await createAndroidRenditions(folder, item);
    }
    try {
        await application.createRenditions(renditions);
        return showDialog('Generate with Sucess');
    } catch (err) {
        return showDialog('Try Again', true);
    }
}

module.exports = {
    exportIcon: exportIcon,
};


async function createIosRenditions(folder, item) {
    const renditions = [];
    const scales = [1024, 167, 20, 40, 60, 29, 58, 87, 40, 80, 120, 120, 180, 76, 152];
    const names = ['1024x1024@1', '83.5x83.5@2', '20x20@1', '20x20@2', '20x20@3', '29x29@1', '29x29@2', '29x29@3', '40x40@1', '40x40@2', '40x40@3', '60x60@2', '60x60@3', '76x76@1', '76x76@2',];
    for (let i = 0; i < Math.min(scales.length, names.length); i++) {
        const file = await folder.createFile(`Icon-App-${names[i]}x.png`, { overwrite: true });
        let obj = {};
        obj.node = item;
        obj.outputFile = file;
        obj.type = application.RenditionType.PNG;
        obj.scale = scales[i] / 1024;
        renditions.push(obj);
    }
    return renditions;
}

async function createAndroidRenditions(folder) {
    const renditions = [];
    /*const scales = [1024, 167, 20, 40, 60, 29, 58, 87, 40, 80, 120, 120, 180, 76, 152];
    const names = ['1024x1024@1', '83.5x83.5@2', '20x20@1', '20x20@2', '20x20@3', '29x29@1', '29x29@2', '29x29@3', '40x40@1', '40x40@2', '40x40@3', '60x60@2', '60x60@3', '76x76@1', '76x76@2',];
    for (let i = 0; i < Math.min(scales.length, names.length); i++) {
        const file = await folder.createFile(`Icon-App-${names[i]}x.png`, { overwrite: true });
        let obj = {};
        obj.node = item;
        obj.outputFile = file;
        obj.type = application.RenditionType.PNG;
        obj.scale = 1024 / scales[i];
        renditions.push(obj);
    }*/
    return renditions;
}


function showDialog(text, error) {
    const dialog = createDialog(text, error);
    return dialog.showModal();
}

function createDialog(text, error) {
    document.body.innerHTML = `
      <style>
      form {
        width: 400px;
      }
      </style>
      <dialog id="dialog">
          <form method="dialog">
              <h1 ${error ? `class="color-red"` : `class="color-green"`}>${error ? 'Error' : 'Sucess'}</h1>
              <hr>
              <h1> </h1><h1> </h1><h1> </h1><h1> </h1>
              <p>${text}</p>
              <footer>
              <button type="submit" uxp-variant="primary" id="ok-button">Close</button>
              </footer>
          </form>
      </dialog>
    `;

    // Remove the dialog from the DOM every time it closes.
    // Note that this isn't your only option for DOM cleanup.
    // You can also leave the dialog in the DOM and reuse it.
    // See the `ui-html` sample for an example.
    const dialog = document.querySelector("#dialog");
    dialog.addEventListener("close", function () {
        dialog.close();
    });
    return dialog;
}
