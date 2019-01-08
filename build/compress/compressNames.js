module.exports = function compressNames(code) {

  function hash(id) {
    let charsA = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_$";
    let charsB = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_$";
    if(id == 0) {
      return "$" + charsA[0];
    }
    let result = "";
    let rest;

    rest = id % charsA.length;
    result += charsA[rest];
    id = Math.floor(id/charsA.length);

    while(id > 0) {
      rest = id % charsB.length;
      result += charsB[rest];
      id = Math.floor(id/charsB.length);
    }
    return "$" + result;
  }

  let pattern = /[a-zA-Z\_\-]+\$\$/g;
  let result;

  let tokenList = [];
  let tokenMap = {};

  while ((result = pattern.exec(code)) !== null) {
    if(tokenList.indexOf(result[0]) == -1) {
      tokenList.push(result[0]);
    }
  }

  for(let i = 0; i < tokenList.length; i++) {
    let h = hash(i);
    if(h.length < tokenList[i].length) {
      tokenMap[tokenList[i]] = hash(i);
    }
  }

  for(let token in tokenMap) {
    pattern = token
      .replace(/\$/g, "\\$");
    code = code.replace(new RegExp(pattern, 'g'), tokenMap[token]);
  }

  console.log(`${tokenList.length} tokens shortened`);

  return code;
}
