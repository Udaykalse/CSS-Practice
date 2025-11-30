function aCir(r) {
  return Math.PI * r * r;
}
console.log(aCir(5));


function isAnagram(a, b) {
  if (a.length !== b.length) return false;

  let count = {};

  for (let char of a) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let char of b) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}

console.log(isAnagram("race", "care")); 
