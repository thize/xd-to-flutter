const scenegraph = require("scenegraph");
const commands = require("commands");
const { Rectangle, Color, Group } = require("scenegraph");

//TODO: 
/*
* getFolder() return correct
* console.log change to own console
* exportAndroidAdaptiveIcons
*/

function getFolder() {
    return 'This function is not to be here, this is only to not break';
}

async function exportAppIcon(platform) {
    const isAdaptiveAndroid = platform == 'adaptive-android';
    const item = scenegraph.selection.items[0];
    if (isAdaptiveAndroid && !_isValidAdaptiveItem(item)) {
        console.log('Not Valid Adaptive Icon, try export a Adaptive Icon Example');
    } else if (!item) {
        console.log('Select something');
    } else if (!_is1024SquareItem(item)) {
        console.log("Selected object is not 1024x1024.");
    } else {
        const flutterProjectFolder = getFolder();
        if (!flutterProjectFolder) {
            console.log("Project folder not selected");
        } else {
            new AppIcon(item, flutterProjectFolder).export(platform);
        }
    }
}

function generateAdaptiveIconExample() {
    const selection = scenegraph.selection;
    const background = new Rectangle();
    background.width = 1024;
    background.height = 1024;
    background.fill = new Color("#8F8F8F");
    background.name = 'Background';
    const foreground = new Rectangle();
    foreground.width = 626;
    foreground.height = 626;
    foreground.fill = new Color("#5E5C5C");
    foreground.name = 'Foreground';
    selection.insertionParent.addChild(background);
    selection.insertionParent.addChild(foreground);
    selection.items = [background, foreground];
    commands.group();
    let group = selection.items[0];
    group.name = 'Adaptive Icon Example';
    foreground.moveInParentCoordinates(199, 199);
}

module.exports = {
    exportAppIcon: exportAppIcon,
    generateAdaptiveIconExample: generateAdaptiveIconExample,
};

function _isValidAdaptiveItem(item) {
    const isGroup = item instanceof Group;
    const hasTwoChildren = item.children.length == 2;
    try {
        const backgroundIs1024SquareItem = _is1024SquareItem(item.children.at(0));
        const foregroundIsSmallerThan1024Square = _isSmallerThan1024Square(item.children.at(1));
        return isGroup && hasTwoChildren && backgroundIs1024SquareItem && foregroundIsSmallerThan1024Square;
    } catch (error) {
        return false;
    }
}

function _is1024SquareItem(item) {
    return Math.round(item.localBounds.width) == 1024 && Math.round(item.localBounds.height) == 1024;
}

function _isSmallerThan1024Square(item) {
    return Math.round(item.localBounds.width) <= 1024 && Math.round(item.localBounds.height) <= 1024;
}


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
            } else if (platform == 'adaptive-android') {
                await this.exportAndroidAdaptiveIcons();
            }
        } catch (error) {
            console.log("Folder is not a Flutter Project");
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

    async exportAndroidAdaptiveIcons() {
        console.log('exportAndroidAdaptiveIcons');

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
            console.log(`Generated ${platform} icons with Sucess`);
        } catch (err) {
            console.log('Error when generating');
        }
    }
}