import { configureStore } from "@reduxjs/toolkit";
import sectionSlice from "../slice/section";
import { vcDataSlice, vcDataErrorSlice } from "../slice/vcData";
import messageSlice from "../slice/message";
import errorMessageSlice from "../slice/errorMessage";
import vpListSlice from "../slice/vpList";
import { loadingDotsSlice, waitingSlice } from "../slice/waiting";
import voterVerifiedSlice from "../slice/verified";

const store = configureStore({
    reducer: {
        sectionReducer: sectionSlice.reducer,
        vcDataReducer: vcDataSlice.reducer,
        vcDataErrorReducer: vcDataErrorSlice.reducer,
        messageReducer: messageSlice.reducer,
        errorMessageReducer: errorMessageSlice.reducer,
        vpListReducer: vpListSlice.reducer,
        waitingReducer: waitingSlice.reducer,
        loadingDotsReducer: loadingDotsSlice.reducer,
        voterVerifiedReducer: voterVerifiedSlice.reducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;