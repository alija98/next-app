import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  _id: string;
}

const userInitialState: UserState = {
  name: '',
  _id: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state._id = action.payload._id;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: () => {},
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
