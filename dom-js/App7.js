function secondLargest(arr) {
  let u = [...new Set(arr)];
  u.sort((a, b) => b - a);
  return u[1];
}
console.log(secondLargest([1, 2, 32, 14, 6, 77, 88, 9, 1]));
