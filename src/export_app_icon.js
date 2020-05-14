const scenegraph = require("scenegraph");
const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const { Color } = require("scenegraph");

async function exportAppIcon(platform) {
    const item = scenegraph.selection.items[0];
    if (item == null) return showDialog("Select something", true);
    if (validateSize(item)) return showDialog("Selected object is not 1024x1024.", true);
    const flutterProjectFolder = await fs.getFolder();
    if (!flutterProjectFolder) return;
    new AppIcon(item, flutterProjectFolder).export(platform);
}

function validateSize(item) {
    return Math.round(item.localBounds.width) != 1024 || Math.round(item.localBounds.height) != 1024;
}

module.exports = {
    exportAppIcon: exportAppIcon,
};

class AppIcon {
    constructor(item, flutterProjectFolder) {
        this.item = item;
        this.renditions = [];
        this.flutterProjectFolder = flutterProjectFolder;
    }

    async export(platform) {
        try {
            if (platform == 'ios') {
                await this.exportIosIcons();
            } else if (platform == 'android') {
                await this.exportAndroidIcons();
            }
        } catch (error) {
            return showDialog("Folder is not a Flutter Project", true);
        }
    }

    async exportIosIcons() {
        const assetsFolder = await this.flutterProjectFolder.getEntry('ios/Runner/Assets.xcassets/AppIcon.appiconset');
        const scales = [1024, 167, 20, 40, 60, 29, 58, 87, 40, 80, 120, 120, 180, 76, 152];
        const names = ['1024x1024@1', '83.5x83.5@2', '20x20@1', '20x20@2', '20x20@3', '29x29@1', '29x29@2', '29x29@3', '40x40@1', '40x40@2', '40x40@3', '60x60@2', '60x60@3', '76x76@1', '76x76@2',];
        for (let i = 0; i < Math.min(scales.length, names.length); i++) {
            const file = await assetsFolder.createFile(`Icon-App-${names[i]}x.png`, { overwrite: true });
            const obj = this.generateRenditionObject(scales[i], file, true);
            this.renditions.push(obj);
        }
        this.createRenditions();

    }

    async exportAndroidIcons() {
        const resFolder = await this.flutterProjectFolder.getEntry('android/app/src/main/res');
        const entrys = [await resFolder.getEntry('mipmap-hdpi'), await resFolder.getEntry('mipmap-mdpi'), await resFolder.getEntry('mipmap-xhdpi'), await resFolder.getEntry('mipmap-xxhdpi'), await resFolder.getEntry('mipmap-xxxhdpi')];
        const scales = [72, 48, 96, 144, 192];
        for (let i = 0; i < entrys.length; i++) {
            const file = await entrys[i].createFile(`ic_launcher.png`, { overwrite: true });
            const obj = this.generateRenditionObject(scales[i], file);
            this.renditions.push(obj);
        }
        this.createRenditions();
    }

    generateRenditionObject(scale, file, withoutAlpha) {
        let obj = {};
        obj.node = this.item;
        obj.outputFile = file;
        obj.type = application.RenditionType.PNG;
        obj.scale = scale / 1024;
        if (withoutAlpha) {
            obj.background = new Color("#FFFFFF");
        }
        return obj;
    }

    async createRenditions() {
        try {
            await application.createRenditions(this.renditions);
            return showDialog('Generate with Sucess');
        } catch (err) {
            return showDialog('Try Again', true);
        }
    }

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
    const dialog = document.querySelector("#dialog");
    dialog.addEventListener("close", function () {
        dialog.close();
    });
    return dialog;
}
