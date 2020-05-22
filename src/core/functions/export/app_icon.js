const scenegraph = require("scenegraph");
const application = require("application");
const { getFolder } = require("../util/project_folder");
const { changeOutputUiText } = require("../../../ui/components/output_ui");
const { Color } = require("scenegraph");

async function exportAppIcon(platform) {
    const item = scenegraph.selection.items[0];
    if (item == null) return changeOutputUiText("Select something", 'red');
    if (validateSize(item)) return changeOutputUiText("Selected object is not 1024x1024.", 'red');
    const flutterProjectFolder = getFolder();
    if (!flutterProjectFolder) return changeOutputUiText("Project folder not selected", 'red');
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
            return changeOutputUiText("Folder is not a Flutter Project", 'red');
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
        this.createRenditions('iOS');

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
        this.createRenditions('Android');
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

    async createRenditions(platform) {
        try {
            await application.createRenditions(this.renditions);
            return changeOutputUiText(`Generate ${platform} icons with Sucess`);
        } catch (err) {
            return changeOutputUiText('Error when generating', 'red');
        }
    }
}