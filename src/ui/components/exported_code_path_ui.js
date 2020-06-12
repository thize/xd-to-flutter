function exportedCodePath() {
    const title = '<H2>Exported Code Path</H2>';
    const input = '<input class="uiTextField" type="TextField" id="exportedCode" name="exportedCode" placeholder="lib/xd">';
    return title + input;
}

module.exports = {
    exportedCodePath: exportedCodePath,
};
