function hasProperty(obj, prop) {
  return obj.hasOwnProperty(prop);
}
console.log(hasProperty({ a: 1 }, "a"));
