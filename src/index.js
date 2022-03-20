import React from 'react'
import ReactDOM from 'react-dom'
// import App from './App'
import Home from './pages/Home';
import { initContract } from './utils'

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      // <App />,
      <Home />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
