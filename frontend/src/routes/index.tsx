import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { CategoryManagePage } from '@/features/category/pages/CategoryManagePage'
import { ArticleListPage } from '@/features/article/pages/ArticleListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'categories',
        element: <CategoryManagePage />,
      },
      {
        path: 'articles',
        element: <ArticleListPage />,
      },
      {
        path: 'admin',
        element: <Navigate to="/categories" replace />,
      },
      {
        path: 'admin/*',
        element: <Navigate to="/categories" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
