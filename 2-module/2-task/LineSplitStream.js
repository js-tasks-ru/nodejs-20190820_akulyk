const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #data = [];

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString();
    data = data.trim();

    if (data.indexOf(os.EOL) !== -1) {
      let tmp = data.split(os.EOL);

      for (let i = 0; i < tmp.length - 1; i++) {

        this.#data.push(tmp[i]);
        this.push(this.#data.join(''));
        this.#data = [];
      }

      this.#data.push(tmp.pop());
      callback(null);
      return;

    } else {
      this.#data.push(data);
    }
    callback(null);
  }

  _flush(callback) {
    callback(null, this.#data.join(''));
  }
}

module.exports = LineSplitStream;
