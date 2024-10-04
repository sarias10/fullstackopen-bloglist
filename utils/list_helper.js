// Aquí se guardan las funciones a probar
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    /*La función devuelve la suma total de
      me gusta en todas las publicaciones
      del blog
      */
    const initialValue = 0
    const sumWTotalLikes = blogs.reduce(
        (accumulator, currentValue) =>
            accumulator + currentValue.likes,
        initialValue
    )
    return blogs.length === 0
        ? 0
        : sumWTotalLikes

}

const favoriteBlog = (blogs) => {

    /*La función recibe una lista de blogs como parámetro.
    La función descubre qué blog tiene más
    Me gusta. Si hay muchos favoritos, basta con
    devolver uno de ellos.
    */

    //desestructuramos el objeto en sus propiedades y nos quedamos con el rest
    const mayor = blogs.map(({ _id, url,__v, ...rest}) => (rest))
    //el initialValue es {} (objeto vacio), max es el accumulator y blog es el currentValue
    //si los likes del objeto max(accumulator) son mayores al del objeto likes(currentValue)
    //entonces max queda con el mismo objeto, sino, max pasa a ser el currentValue
        .reduce(
            (max, blog) => max.likes > blog.likes ? max = max : max = blog, {}
        )
    return mayor
}

const mostBlogs = (blogs) => {
    const uniqueAuthors = _.maxBy(_.map(_.countBy(blogs, 'author'), (val,key) => ({author:key,blogs:val})),'blogs')

    return uniqueAuthors
}

const mostLikes = (blogs) => {
    const authors = _.maxBy(_.map(_.groupBy(blogs, 'author'),(val, key)=>({author: key, likes:_.sumBy(val,'likes')})),'likes')

    return authors
}

module.exports ={
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}