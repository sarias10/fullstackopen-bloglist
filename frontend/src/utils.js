const compareFn = (list) => {
  //ordena la lista de objetos por la cantidad de likes de forma descendente
  const newList = list.sort((a,b) => b.likes - a.likes)
  return newList
}

export {
  compareFn
}