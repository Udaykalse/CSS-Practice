const arr = [3, 7, 2, 9, 4];

let max = arr[0];
for (let n of arr) {
  if (n > max) max = n;
}

console.log(max);
