// Aquí se guardan las funciones a probar

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    /*La función devuelve la suma total de 
      me gusta en todas las publicaciones 
      del blog*/
      const initialValue = 0;
      const sumWTotalLikes = blogs.reduce(
        (accumulator, currentValue) =>
            accumulator + currentValue.likes, 
            initialValue
      )
      return blogs.length === 0 
       ? 0
       : sumWTotalLikes
       
}

module.exports ={
    dummy,
    totalLikes
}