const sentence = "JavaScript isdfghjkiuytr awesome";

let w = sentence.split(" ");
let l = "";

for (let w1 of w) {
  if (w1.length > l.length) l = w1;
}

console.log(l);
