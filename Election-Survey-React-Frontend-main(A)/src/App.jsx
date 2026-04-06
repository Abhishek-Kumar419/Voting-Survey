import { router } from './router/router';
import { RouterProvider } from "react-router-dom";
import { ElectionDataProvider } from "./context/ElectionDataContext";

const App = () => {
    return (
        <ElectionDataProvider>
            <RouterProvider router={router} />
        </ElectionDataProvider>
    );
};

export default App;
