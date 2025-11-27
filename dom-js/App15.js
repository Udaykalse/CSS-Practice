function removeFalsy(arr) {
    return arr.filter(Boolean);
};

console.log(removeFalsy([0, 1, false, 2, '', 3]));