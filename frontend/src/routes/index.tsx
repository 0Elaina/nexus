import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { CategoryManagePage } from '@/features/category/pages/CategoryManagePage'
import { ArticleListPage } from '@/features/article/pages/ArticleListPage'
import { ArticleDetailPage } from '@/features/article/pages/ArticleDetailPage'
import { ArticleEditorPage } from '@/features/article/pages/ArticleEditorPage'

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
        path: 'articles/:id',
        element: <ArticleDetailPage />,
      },
      {
        path: 'articles/write',
        element: <ArticleEditorPage />,
      },
      {
        path: 'articles/edit/:id',
        element: <ArticleEditorPage />,
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
