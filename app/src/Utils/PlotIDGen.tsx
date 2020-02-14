export default function getPlotId() {
  return `plot${new Date().getTime().toString()}`;
}
