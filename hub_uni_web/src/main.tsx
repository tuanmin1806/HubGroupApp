import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Provider } from 'react-redux'
import store from './app/store'
import GlobalSnackbar from './components/snackbar/global.snackbar'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
        <GlobalSnackbar></GlobalSnackbar>
        <RouterProvider router={router} />
    </Provider>
)
