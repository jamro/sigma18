module.exports = function compressText(code) {

  function processText(code, processor) {
    let buffer = "";
    let recording = false;
    let quote = null;
    let result = "";
    for(let i=0; i < code.length; i++) {
      let char = code[i];
      if(!recording && (char == '"' || char == "'")) {
        recording = true;
        quote = char;
        buffer += char;
        continue;
      }
      if(recording && char == quote && buffer[buffer.length-1] != "\\") {
        recording = false;
        buffer += char;
        if(result.substring(result.length-4, result.length) == 'case') {
          result += buffer;
        } else {
          let replacement = processor(buffer);
          if(typeof replacement == 'string') {
            result += replacement;
          } else {
            result += buffer;
          }
        }
        buffer = '';
        continue;
      }
      if(recording) {
        buffer += char;
      } else {
        result += char;
      }
    }
    return result;
  }

  return code;
}
