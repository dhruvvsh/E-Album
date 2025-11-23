// This file defines JSDoc typedefs for use in JavaScript projects

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} memoryId
 * @property {User} author
 * @property {string} text
 * @property {string} timestamp
 */

/**
 * @typedef {Object} Memory
 * @property {string} id
 * @property {string} tripId
 * @property {string} image
 * @property {string} description
 * @property {User} author
 * @property {string} timestamp
 * @property {string} [location]
 * @property {number} likes
 * @property {boolean} isLiked
 * @property {Comment[]} comments
 */

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} coverPhoto
 * @property {User[]} participants
 * @property {User} createdBy
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {Memory[]} memories
 * @property {boolean} isPrivate
 */

/**
 * @typedef {'posts' | 'trips' | 'profile' | 'settings'} ViewType
 */
