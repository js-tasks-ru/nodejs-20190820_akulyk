const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {

  #limit;
  #streamSize = 0;

  constructor(options) {
    super(options);
    this.#limit = options.limit || 0;
  }

  _transform(chunk, encoding, callback) {
    if(this.#limit > 0 && (chunk.length + this.#streamSize) > this.#limit){
      callback(new LimitExceededError());
      return;
    }
    this.#streamSize += chunk.length;
    callback(null, chunk.toString());
  }
}

module.exports = LimitSizeStream;
