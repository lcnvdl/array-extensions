/**
 *
 * Javascript Array Extensions
 *
 * Programming by Junil, Um
 *
 * http://powerumc.kr
 * http://blog.powerumc.kr
 * http://devwith.com
 *
 */

const _MESSAGE_OF_NULL_REFERENCES = function (argName) {
  return `${argName} is null (a) references.`;
};
const _MESSAGE_OF_NULL_ARGUMENTS = function (argName) {
  return `${argName} is null (an) arguments`;
};
const _MESSAGE_OF_INVALID_ARGUMENTS = function (argName, needsType) {
  return `${argName} is (an) invalid arguments.${!needsType ? `It's have to ${needsType}` : ""}`;
};
const _MESSAGE_OF_NOT_SUPPORT_ARGUMENTS = function (argName, argObject) {
  return `${typeof argObject} type of ${argName} argument is not support`;
};

var foreach = foreach || {

  continue: true,
  break: false,

};

var comparer = comparer || {
  _ascending(a, b) {
    return a - b;
  },
  ascending: this._ascending,
  asc: this.ascending,
  _descending(a, b) {
    return b - a;
  },
  descending: this._descending,
  desc: this.descending,
};

function isFunction(fn) {
  return typeof fn === "function";
}

function isArray(obj) {
  return typeof obj === "object" && obj instanceof Array;
}

function isObject(obj) {
  return typeof obj === "object" && (isArray(obj) === false);
}

function isNumber(obj) {
  return typeof obj === "number" || obj instanceof Number;
}

function isString(obj) {
  return typeof obj === "string" || obj instanceof String;
}

function isBoolean(obj) {
  return typeof obj === "boolean";
}

function isContains(source, object) {
  if (arguments.length === 0) throw "second argument needs an array";
  if (!source) throw _MESSAGE_OF_NULL_ARGUMENTS("source");
  if (!object) throw _MESSAGE_OF_NULL_ARGUMENTS("object");

  if (source.isString()) {
    return source.indexOf(object) >= 0;
  } if (source.isArray()) {
    for (let i = 0; i < source.length; i++) {
      if (source[i] == object) return true;
    }

    return false;
  }

  throw _MESSAGE_OF_NOT_SUPPORT_ARGUMENTS("source", source);
}

function _cloneObject(obj) {
  console.info(`${obj.toString()} cloned type = ${typeof obj}`);

  if (isString(obj) || isNumber(obj) || isBoolean(obj)) {
    return obj.constructor(obj);
  }

  if (isArray(obj)) {
    return Array.clone(obj);
  }

  const prop = Object.getOwnPropertyNames(obj);
  if (prop && prop.length === 0) {
    return new Object(obj);
  }
  const newObj = {};
  for (let i = 0; i < prop.length; i++) {
    const item = obj[prop[i]];

    if (isObject(item)) {
      _cloneObject(item);
    }

    newObj[prop[i]] = item;
  }

  return newObj;
}

function print(obj) {
  if (isString(obj) || isNumber(obj) || isBoolean(obj)) {
    console.info(`print :      ${obj}`);
    return;
  }

  const prop = Object.getOwnPropertyNames(obj);
  if (prop && prop.length === 0) {
    return;
  }
  for (let i = 0; i < prop.length; i++) {
    console.info(`print : ${prop[i]}`);

    const item = obj[prop[i]];

    print(item);
  }
}

Object.clone = function (obj) {
  return _cloneObject(obj);
};

Object.prototype.isFunction = function () {
  return isFunction(this);
};

Object.prototype.isArray = function () {
  return isArray(this);
};

Object.prototype.isObject = function () {
  return isObject(this);
};

Object.prototype.isNumber = function () {
  return isNumber(this);
};

Object.prototype.isString = function () {
  return isString(this);
};

Object.prototype.equals = function (destination) {
  if (isArray(this) && destination.isArray()) return !(this > destination || this < destination);
  if (isObject(this)) {
    return this == destination;
  }

  return this == destination;
};

Array.clone = function (array) {
  array = (array && array.isArray()) ? array : [array];

  const arr = [];
  for (let i = 0; i < array.length; i++) {
    arr.push(Object.clone(array[i]));
  }

  return arr;
};

Array.prototype.foreach = function (fn, args) {
  if (this.isArray()) {
    if (fn.isFunction()) {
      let num; let obj; let
        param;
      for (let i = 0; i < this.length; i++) {
        num = i;
        obj = this[i];
        param = args;

        if (fn.length === 1) num = obj;

        const isContinue = fn.apply(this, [num, this[i], args]);

        if (isContinue === false) break;
      }
    }
  }
};

Array.prototype.any = function (predicate) {
  if (predicate && predicate.isFunction()) {
    for (var i = 0, item; item = this[i]; i++) {
      if (predicate(item)) return true;
    }

    return false;
  }

  if (this.length > 0) return true;
};

Array.prototype.first = function (predicate) {
  if (predicate && predicate.isFunction()) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i])) return this[i];
    }

    throw _MESSAGE_OF_NULL_REFERENCES("no predicate");
  }
  else {
    const ret = this.length > 0 ? this[0] : null;
    if (ret === null) throw _MESSAGE_OF_NULL_REFERENCES("ret");

    return ret;
  }
};

Array.prototype.firstOrDefault = function (predicate) {
  if (predicate && predicate.isFunction()) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i])) return this[i];
    }

    return null;
  }

  return this.length > 0 ? this[0] : null;
};

Array.prototype.firstOrNew = function (predicate) {
  const first = this.firstOrDefault(predicate);

  return first || [];
};

Array.prototype.lastOrDefault = function (predicate) {
  if (predicate && predicate.isFunction()) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i])) return this[i];
    }

    return null;
  }

  const ret = this.length > 0 ? this[this.length - 1] : null;
  if (ret === null) return null;

  return ret;
};

Array.prototype.lastOrNew = function (predicate) {
  const last = this.lastOrDefault(predicate);

  return last || [];
};

Array.prototype.last = function (predicate) {
  const last = this.lastOrDefault(predicate);
  return last;
};

Array.prototype.select = function (selector) {
  if (selector && selector.isFunction()) {
    const arr = [];
    for (let i = 0; i < this.length; i++) {
      arr.push(selector(this[i]));
    }

    return arr;
  }
};

Array.prototype.where = function (selector) {
  const arr = []; let
    i;
  if (selector && selector.isFunction()) {
    for (i = 0; i < this.length; i++) {
      if (selector(this[i])) {
        arr.push(this[i]);
      }
    }

    return arr;
  }
  for (i = 0; i < this.length; i++) {
    if (this[i] == selector) {
      arr.push(this[i]);
    }
  }

  return arr;
};

Array.prototype.orderBy = function (_comparer) {
  _comparer = _comparer || comparer.ascending;

  return this.sort(_comparer);
};

Array.prototype.take = function (number) {
  if (arguments.length === 0) throw "take method needs an argument of number";

  if (number && number.isNumber()) {
    number = number > this.length ? this.length : number;

    const arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(this[i]);
    }

    return arr;
  }
};

Array.prototype.skip = function (number) {
  if (arguments.length === 0) throw "skip method needs an argument of number";

  if (number && number.isNumber()) {
    number = number > this.length ? this.length : number;

    const arr = [];
    for (let i = number; i < this.length; i++) {
      arr.push(this[i]);
    }

    return arr;
  }
};

Array.prototype.sum = function (selector) {
  let sum = 0; let
    i;
  if (selector && selector.isFunction()) {
    for (i = 0; i < this.length; i++) {
      sum += selector(this[i]);
    }
  }
  else {
    for (i = 0; i < this.length; i++) {
      const current = this[i];

      if (current.isNumber()) {
        sum += current;
      }
      else if (current.isString()) {
        if (current.indexOf(".") > 0) {
          sum += parseFloat(current);
        }
        else {
          sum += parseInt(current);
        }
      }
    }
  }

  return sum;
};

Array.prototype.average = function (selector) {
  if (this.length === 0) return 0;

  const sum = this.sum(selector);
  return sum / this.length;
};

Array.prototype.max = function (predicate) {
  let max; let
    i;

  if (this.length === 0) throw "no array data";
  if (this.length > 0) max = this[0];

  if (predicate && predicate.isFunction()) {
    for (i = 0; i < this.length; i++) {
      const pred = predicate(this[i]);
      if (pred && max < this[i]) {
        max = this[i];
      }
    }
  }
  else {
    for (i = 0; i < this.length; i++) {
      const dest = this[i];
      if (max < dest) {
        max = dest;
      }
    }
  }

  return max;
};

Array.prototype.min = function (predicate) {
  let min; let
    i;

  if (this.length === 0) throw "no array data";

  if (this.length > 0) min = this[0];

  if (predicate && predicate.isFunction()) {
    for (i = 0; i < this.length; i++) {
      const pred = predicate(this[i]);
      if (pred && min > this[i]) {
        min = this[i];
      }
    }
  }
  else {
    for (i = 0; i < this.length; i++) {
      const dest = this[i];
      if (min > dest) {
        min = dest;
      }
    }
  }

  return min;
};

Array.range = function (start, max, step) {
  if (arguments.length === 0) throw "range method needs one or more arguments";
  if (start && !start.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("start", "Number");
  if (max && !max.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("max", "Number");
  if (step && !step.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("step", "Number");

  const arr = [];
  _range(arr, start, max, step);

  return arr;
};

function _range(arr, start, max, step) {
  step = step || 1;

  if (!arr || !arr.isArray()) throw _MESSAGE_OF_NULL_ARGUMENTS("arr");
  if (!max) {
    max = start;
    start = 0;
  }

  if (start >= max) return;

  for (let i = start; i < max; i += step) {
    arr.push(i);
  }
}

Array.prototype.range = function (start, max, step) {
  if (arguments.length === 0) throw "range method needs one or more arguments";
  if (start && !start.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("start", "Number");
  if (max && !max.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("max", "Number");
  if (step && !step.isNumber()) throw _MESSAGE_OF_INVALID_ARGUMENTS("step", "Number");

  _range(this, start, max, step);

  return this;
};

function _union(first, second) {
  let i;

  if (arguments.length < 1) throw "second argument needs an array";

  first = (first && first.isArray()) ? first : [first];
  const arr = Array.clone(first);

  for (i = 1; i < arguments.length; i++) {
    second = arguments[i];
    if (!second) continue;

    second = (second && second.isArray()) ? second : [second];

    for (i = 0; i < second.length; i++) {
      arr.push(Object.clone(second[i]));
    }
  }

  return arr;
}

Object.union = _union;

Array.union = _union;

Array.prototype.union = Array.prototype.union || function (second) {
  if (arguments.length === 0) throw "second argument needs an array";
  if (second && !second.isArray()) throw _MESSAGE_OF_INVALID_ARGUMENTS("second", "Array");

  return _union.apply(this, arguments);
};

Array.distinct = function (first, second) {
  const arr = [];
  for (let i = 0; i < arguments.length; i++) {
    if (!arguments[i]) throw _MESSAGE_OF_NULL_ARGUMENTS(`${i} index argument`);
    if (!arguments[i].isArray()) throw _MESSAGE_OF_INVALID_ARGUMENTS(`${i} index argument`, "Array");
    if (arguments.length === 0) continue;

    for (let x = 0; x < arguments[i].length; x++) {
      const pickup = arguments[i][x];
      if (!isContains(arr, pickup)) arr.push(pickup);
    }
  }

  return arr;
};

Array.prototype.distinct = Array.distinct;

function _join(first, second, primaryKey, foreignKey, selector) {
  if (!first) throw _MESSAGE_OF_NULL_ARGUMENTS("first");
  if (!second) throw _MESSAGE_OF_NULL_ARGUMENTS("second");

  if (!first.isArray()) throw _MESSAGE_OF_NOT_SUPPORT_ARGUMENTS("first", first);
  if (!second.isArray()) throw _MESSAGE_OF_NOT_SUPPORT_ARGUMENTS("second", second);

  const arr = [];
  primaryKey = primaryKey || function (a) {
    return a;
  };
  foreignKey = foreignKey || function (b) {
    return b;
  };
  selector = selector || function (a, b) {
    return a;
  };

  for (let l = 0; l < first.length; l++) {
    for (let r = 0; r < second.length; r++) {
      const args = [first[l], second[r]];
      const a = primaryKey(first[l]);
      const b = foreignKey(second[r]);

      const isMatch = a === b;
      if (isMatch !== undefined && isMatch) {
        const result = selector.apply(this, args);
        arr.push(result);
      }
    }
  }

  return arr;
}

Array.innerJoin = Array.innerJoin || _join;

Array.prototype.innerJoin = Array.prototype.innerJoin || function (dest, primaryKey, foreignKey, selector) {
  return _join(this, dest, primaryKey, foreignKey, selector);
};
