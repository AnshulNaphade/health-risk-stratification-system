import './style.css'
import { router } from './components/router.js'

window.addEventListener('hashchange', router)
window.addEventListener('load', router)