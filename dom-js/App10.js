function countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}

console.log(countVowels("Hello world"));
