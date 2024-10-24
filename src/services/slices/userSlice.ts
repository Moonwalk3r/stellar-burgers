import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null | undefined;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'auth/user',
  async (data: Partial<TRegisterData>) => {
    await updateUserApi(data);
    return getUserApi();
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userAuth = createAsyncThunk(
  'auth/userAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
  selectors: {
    selectUser: (state: TUserState) => state.user,
    selectIsAuthChecked: (state: TUserState) => state.isAuthChecked,
    selectUserName: (state: TUserState) => state.user?.name
  }
});

export const { selectUser, selectIsAuthChecked, selectUserName } =
  userSlice.selectors;

export const { setUser, setIsAuthChecked } = userSlice.actions;
