const arr = [1, 2, 2, 3, 4, 4, 5];

const r = [...new Set(arr)];

console.log(r);
console.log("-------------------------------");
const res = arr.filter((v, i) => {
  return arr.indexOf(v) === i;
});

console.log(res);

console.log("-------------------------------");

const resu = arr.reduce((a, c) => {
  if (!a.includes(c)) {
    a.push(c);
  }
  return a;
}, []);

console.log(resu);

console.log("-------------------------------");

const resul = [];

arr.forEach((itM) => {
  if (!resul.includes(itM)) {
    resul.push(itM);
  }
});

console.log(resul);
console.log("-------------------------------");

arr.sort();

let result = [arr[0]];

for (let i = 1; i < arr.length; i++) {
  if (arr[i] !== arr[i - 1]) {
    result.push(arr[i]);
  }
}

console.log(result);
