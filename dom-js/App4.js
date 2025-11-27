function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 1, 2, 3, 4, 3, 2, 1, 4, 5, 6, 54, 3]));
