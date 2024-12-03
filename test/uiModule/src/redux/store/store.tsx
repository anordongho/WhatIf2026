import { configureStore } from "@reduxjs/toolkit";
import sectionSlice from "../slice/section";
import { vcDataSlice, vcDataErrorSlice } from "../slice/vcData";
import messageSlice from "../slice/message";
import errorMessageSlice from "../slice/errorMessage";

const store = configureStore({
    reducer: {
        sectionReducer: sectionSlice.reducer,
        vcDataReducer: vcDataSlice.reducer,
        vcDataErrorReducer: vcDataErrorSlice.reducer,
        messageReducer: messageSlice.reducer,
        errorMessageReducer: errorMessageSlice.reducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;