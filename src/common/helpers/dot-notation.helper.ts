/**
 * Transform array of string dot-notation to object
 * ['foo.bar', 'foo.other', 'foo.bar.sub'] =>
 * {
 *  foo: {
 *    other: true,
 *    bar: {
 *      sub: true
 *    }
 *  }
 * }
 * @param array
 * @param initialObject
 * @param value
 * @returns
 */
export const dotNotation = (
  array: string[],
  initialValue: any = true,
  initialObject: any = {},
): any =>
  array.reduce((result, objectPath) => {
    const parts = objectPath.split('.');
    let target = result;

    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = typeof target[part] === 'object' ? target[part] : {};
    }

    target[parts[0]] = initialValue;
    return result;
  }, initialObject);
