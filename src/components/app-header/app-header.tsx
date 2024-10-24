import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUserName } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName) || 'Личный кабинет';
  return <AppHeaderUI userName={userName} />;
};
