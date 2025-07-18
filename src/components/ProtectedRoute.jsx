import React from 'react'
import { useAuth } from '@/store/useAuth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const { isAuthenticated } = useAuth(state => state)
  if(!isAuthenticated){
    return <Navigate to="/auth/login" />
  }
  return (
    children
  )
}
