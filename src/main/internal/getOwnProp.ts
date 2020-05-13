export default getOwnProp

function getOwnProp(obj: any, propName: string) {
  return obj === undefined || obj === null || Object.prototype.hasOwnProperty.call(obj, propName)
    ? obj[propName]
    : undefined
}