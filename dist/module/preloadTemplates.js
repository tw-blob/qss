export const preloadTemplates = async function () {
    const templatePaths = [
        // Add paths to "modules/quick-status-select/templates"
        './../templates/qss.hbs',
    ];
    return loadTemplates(templatePaths);
};
