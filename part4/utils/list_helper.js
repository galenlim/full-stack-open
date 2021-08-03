const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)

    const reducer = (sum, item) => {
        return sum + item
    }

    return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        const sortedByLikes = blogs.sort((first, second) => {
            return second.likes - first.likes
        })

        const result = (({ title, author, likes }) => ({ title, author, likes }))(sortedByLikes[0])

        return result
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const blogCountByAuthor = _.countBy(blogs, 'author')
    const authorCounts = _.toPairs(blogCountByAuthor)
    const topAuthor = _.sortBy(authorCounts, authorCount => -authorCount[1])[0]
    return { 'author': topAuthor[0], 'blogs': topAuthor[1] }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const groupByAuthor = _.groupBy(blogs, 'author')
    const authorTotalLikes = _.mapValues(groupByAuthor, (groups) => _.sumBy(groups, 'likes'))
    const authorLikesArray = _.toPairs(authorTotalLikes)
    const topAuthor = _.sortBy(authorLikesArray, author => -author[1])[0]
    return { 'author': topAuthor[0], 'likes': topAuthor[1] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
