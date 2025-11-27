function isPalindrome(str) {
  let str1 = str.split("").reverse().join("");
  return str1 === str;
}

console.log(isPalindrome("madam"));
