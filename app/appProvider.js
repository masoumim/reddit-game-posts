// appProvider.js - This file import's the 'react-redux' library's <Provider> component which makes the store's state available
// from any component. The AppProvider component takes a single 'children' prop which will be passed down from the 'RootLayout'
// component in the root layout.js file.

"use client";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function AppProvider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}