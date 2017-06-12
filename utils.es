// enumFromTo(x,y) = [x,x+1,x+2...y]
// only guarantee to work on increasing sequences
const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

function warn(...args) {
  return console.warn.apply(this, args)
}

function error(...args) {
  return console.error.apply(this, args)
}


// usage: "ignore(a,b,c)" to fool eslint to believe that "a", "b" and "c"
// are somehow being used, it serves as an explicit annotation to say that they actually don't
const ignore = () => undefined

const identity = x => x

const not = x => !x

// "modifyArray(index,f)(xs)" keeps "xs" intact and returns a new array
// whose element on "index" is modified by feeding original value to "f".
// if "index" is out of range, "xs" itself is returned.
const modifyArray = (index, f) => {
  if (typeof index !== 'number')
    console.error('index is not a number')
  if (typeof f !== 'function')
    console.error('modifier is not a function')
  return xs => {
    if (index < 0 || index >= xs.length)
      return xs
    const ys = [...xs]
    const v = ys[index]
    ys[index] = f(v)
    return ys
  }
}

const mkErrorRecorder = () => {
  const errMsgLog = []
  return {
    recordError: msg => errMsgLog.push(msg),
    get: () => errMsgLog,
  }
}

const saturate = (min,max) => v =>
  v < min ? min : (v > max ? max : v)

const shallowObjectEqual = (obj1,obj2) => {
  if (obj1 !== obj2)
    return false
  // know: obj1 & obj2 are not strictly equal
  if (typeof obj1 !== typeof obj2 ||
      /*
         know: obj1 and obj2 are of the same type
       */
      typeof obj1 !== 'object')
    return false
  const keys1 = Object.keys(obj1).sort()
  const keys2 = Object.keys(obj2).sort()
  if (keys1.length !== keys2.length)
    return false
  return keys1.every( (key1, ind) => {
    const key2 = keys2[ind]
    return key1 === key2
  })
}

const precompose = prj => f => (...args) =>
  f(...args.map(prj))

export {
  enumFromTo,
  ignore,
  identity,
  not,

  warn,
  error,

  modifyArray,
  mkErrorRecorder,

  saturate,

  shallowObjectEqual,
  precompose,
}
