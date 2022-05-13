import config from 'config'

function setPageTitle( urlInfo ) {
  document.title = urlInfo.name + ' | ' + config.app.name
}

export default setPageTitle