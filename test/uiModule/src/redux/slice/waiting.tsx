import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum WaitingStatus {
    IDLE,
    ISSUINGVC,
    PRESENTINGVP,
    VERIFYING
}
const initialWaitingState: { waitingStatus: WaitingStatus } = {
    waitingStatus: WaitingStatus.IDLE
};

export const waitingSlice = createSlice({
    name: 'waiting',
    initialState: initialWaitingState,
    reducers: {
        setWaitingStatus: (state, action: PayloadAction<WaitingStatus>) => {
            state.waitingStatus = action.payload;
        },
    }
});

const initialLoadingDotsState: { loadingDots: string } = {
    loadingDots: ''
};

export const loadingDotsSlice = createSlice({
    name: 'loadingDots',
    initialState: initialLoadingDotsState,
    reducers: {
        updateLoadingDots: (state) => {
            if (state.loadingDots.length >= 3) {
                state.loadingDots = '';
            } else {
                state.loadingDots += '.';
            }
        },
    }
});

export const { setWaitingStatus } = waitingSlice.actions;
export const { updateLoadingDots } = loadingDotsSlice.actions;