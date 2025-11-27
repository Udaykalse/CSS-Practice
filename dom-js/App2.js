function capitalizeWords(str) {
  return str
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

console.log(capitalizeWords("hello world"));
