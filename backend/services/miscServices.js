const slug = require('slug')
const { customAlphabet } = require('nanoid')

const generateSlug = async (attempts, target, model, initialValue) => {
  if (attempts > 0) {
    initialValue = initialValue ?? slug(target, '_')
    const uriConflict = await model.findOne({ uri: initialValue })
    if (uriConflict) {
      const randomNumbers = customAlphabet('0123456789', 4)
      const slugUri = `${slug(target, '_')}_${randomNumbers()}`
      return generateSlug(--attempts, target, model, slugUri)
    }
    return initialValue
  }
}

module.exports = generateSlug 