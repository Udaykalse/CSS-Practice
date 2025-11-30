const arr = [1, 2, 3, 4, 5, 6];

let c = 0;

for (let n of arr) {
  if (n % 2 === 0) c++;
}

console.log(c);
