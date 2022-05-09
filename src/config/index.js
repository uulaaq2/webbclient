let env = process.env.REACT_APP_ENV || 'development',
    cfg = require('./config.'+env)

module.exports = cfg
