/*
 * Adds sliders to adjust the border and grid fill opacity of Measured Templates
 */
import getTemplate from './getTemplate.js'

Hooks.once('init', () => {
  // eslint-disable-next-line no-console
  console.log('better-templates | Initializing Better Templates');
});

/*
 * React to MeasuredTemplateConfig opening
 */
Hooks.on('renderMeasuredTemplateConfig', async (app, html) => {
  // Get the template objects
  const t = getTemplate(app.object.id);
  // If there are existing bettertemplate flags, read them, otherwise set default opacity
  let borderOpacity = t.template.getFlag('bettertemplates', 'borderOpacity');
  let fillOpacity = t.template.getFlag('bettertemplates', 'fillOpacity');
  if (borderOpacity === undefined) borderOpacity = 1;
  if (fillOpacity === undefined) fillOpacity = 1;

  // Get the handlebars to be injected
  const path = '/modules/bettertemplates/templates/';
  const borderOpacityControl = await renderTemplate(`${path}border-opacity.html`, { borderOpacity });
  const fillOpacityControl = await renderTemplate(`${path}fill-opacity.html`, { fillOpacity });
  
  // Find form elements and inject their counterparts
  const borderColorInput = $(html).find('[name="borderColor"]').parent();
  const fillColorInput = $(html).find('[name="fillColor"]').parent();
  borderColorInput.after(borderOpacityControl);
  fillColorInput.after(fillOpacityControl);
});

/*
 * If data has bettertemplates values set, add them to flag to be saved to entity
 */
Hooks.on('preUpdateMeasuredTemplate', (scene, entity, data, options, user) => {
  if (!data.flags) data.flags = {};
  data.flags.bettertemplates = {}
  if (data.borderOpacity !== undefined) data.flags.bettertemplates.borderOpacity = data.borderOpacity;
  if (data.fillOpacity !== undefined) data.flags.bettertemplates.fillOpacity = data.fillOpacity;
});

/*
 * React to updates that contain bettertemplates values and set opacity
 */
Hooks.on('updateMeasuredTemplate', async (scene, entity, data) => {
  const t = getTemplate(entity._id);
  if (entity?.flags?.bettertemplates?.borderOpacity !== undefined) t.template.template.alpha = data.borderOpacity;
  if (entity?.flags?.bettertemplates?.fillOpacity !== undefined) t.grid.alpha = data.fillOpacity;
});

/*
 * On canvas ready set any templates that have existing bettertemplates data opacity
 */
Hooks.on('canvasReady', (canvas) => {
  canvas.templates.objects.children.forEach((template) => {
    const borderOpacity = template.getFlag('bettertemplates', 'borderOpacity');
    const fillOpacity = template.getFlag('bettertemplates', 'fillOpacity');
    const t = getTemplate(template.id);
    if (borderOpacity !== undefined) t.template.template.alpha = borderOpacity;
    if (fillOpacity !== undefined) t.grid.alpha = borderOpacity;
  });
});
