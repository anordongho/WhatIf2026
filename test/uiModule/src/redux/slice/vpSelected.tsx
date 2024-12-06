import { createSlice } from '@reduxjs/toolkit';

const initialVpSelectedState: { isSelected: boolean } = {
    isSelected: false
};

export const vpSelectedSlice = createSlice({
    name: 'vpSelected',
    initialState: initialVpSelectedState,
    reducers: {
        setVPSelected: (state) => {
            state.isSelected = true;
        },
        setVPUnselected: (state) => {
            state.isSelected = false;
        },
    }
});

export default vpSelectedSlice;
export const { setVPSelected, setVPUnselected } = vpSelectedSlice.actions;