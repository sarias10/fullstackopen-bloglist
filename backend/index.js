// Este archivo solo importa la aplicación real desde el archivo app.js y luego inicia la aplicación

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})