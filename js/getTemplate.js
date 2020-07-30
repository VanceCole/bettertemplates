export default function getTemplate(id) {
  const template = canvas.templates.get(id);
  const grid = canvas.grid.getHighlightLayer(`Template.${id}`);
  console.log(template);
  return { template, grid };
}
