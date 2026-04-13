import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Provider } from 'react-redux'
import store from './app/store'
import GlobalSnackbar from './components/snackbar/global.snackbar'
import ScrollToTop from './components/general/scroll-to-top'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GlobalSnackbar></GlobalSnackbar>
    <ScrollToTop />
    <RouterProvider router={router} />
  </Provider>
)
