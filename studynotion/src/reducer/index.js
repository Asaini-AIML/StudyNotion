import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlices"
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlices"
import courseReducer from "../slices/courseSlices"
import viewCourseReducer from "../slices/viewCourseSlices"

const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer