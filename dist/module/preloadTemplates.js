export const preloadTemplates = async function () {
    const templatePaths = [
        // Add paths to "modules/quick-status-select/templates"
        './../templates/qss.hbs',
    ];
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    return loadTemplates(templatePaths);
};
