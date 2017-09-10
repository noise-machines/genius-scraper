const isPlainObject = require('is-plain-object')

const filterRecursiveKeys = predicate => original => {
  if (Array.isArray(original)) {
    return original.map(filterRecursiveKeys(predicate))
  } else if (isPlainObject(original)) {
    const filtered = Object.keys(original)
      .filter(predicate)
      .reduce((filtered, key) => {
        filtered[key] = filterRecursiveKeys(predicate)(original[key])
        return filtered
      }, {})
    return filtered
  } else {
    return original
  }
}

/*
const isOk = key => key !== 'current_user_metadata'

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
}

function isObjectObject(o) {
  return (
    isObject(o) === true &&
    Object.prototype.toString.call(o) === '[object Object]'
  )
}

function isPlainObject(o) {
  var ctor, prot

  if (isObjectObject(o) === false) return false

  // If has modified constructor
  ctor = o.constructor
  if (typeof ctor !== 'function') return false

  // If has modified prototype
  prot = ctor.prototype
  if (isObjectObject(prot) === false) return false

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false
  }

  // Most likely a plain Object
  return true
}

filterRecursiveKeys(isOk)({
  title: 'Forgive Me Father',
  current_user_metadata: {
    permissions: ['create_comment']
  },
  description_annotation: {
    annotations: [
      {
        current_user_metadata: {}
      }
    ]
  }
})
*/

module.exports = filterRecursiveKeys
