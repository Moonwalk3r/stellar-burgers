import { Navigate, useLocation } from 'react-router';
import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyAuth = false,
  component
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (!user && !onlyAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (user && onlyAuth) {
    const { from } = (location.state as { from: { pathname: string } }) ?? {
      from: { pathname: '/' }
    };
    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <ProtectedRoute onlyAuth component={component} />;
