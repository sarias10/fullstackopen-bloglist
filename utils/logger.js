// Aqui hay funciones que se utilizan para imprimir mensajes de dos tipos

// para imprimir mensajes de registro normales
const info = (...params) => {
    console.log(...params)
}
// para imprimir mensajes de error
const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}