import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function UserRoute({ children }) {
  const { user } = useUser();
  if (!user || user.role !== 'user') {
    return <Navigate to="/user-login" replace />;
  }
  return children;
}
