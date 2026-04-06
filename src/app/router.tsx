import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { NavigationPage } from '../features/navigation/NavigationPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { BookmarksPage } from '../features/bookmarks/BookmarksPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <NavigationPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />
      }
    ]
  },
])
