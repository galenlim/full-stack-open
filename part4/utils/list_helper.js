const dummy = (blogs) => {
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

        const result = (({title, author, likes}) => ({title, author, likes}))(sortedByLikes[0])

        return result
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

