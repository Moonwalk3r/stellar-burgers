import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';
import { selectUser, updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const user = useSelector(selectUser); // Используем правильный селектор для пользователя
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Инициализация формы значениями пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  // Определение изменения формы
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Обработка отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      dispatch(updateUser(formValue)); // Отправляем обновленные данные пользователя
    }
  };

  // Обработка отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  // Обработка изменения инпутов формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
