const str = "Udaysinh_Kalse";

let c = 0;
const v = "aeiou";

for (let char of str) {
  if (v.includes(char)) c++;
}

console.log(c);
