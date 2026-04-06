import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import UserPrivate from "./UserPrivate";

const Signup           = lazy(() => import("../pages/Signup"));
const Login            = lazy(() => import("../pages/Login"));
const Profile          = lazy(() => import("../pages/Profile"));
const AdminDashboard   = lazy(() => import("../pages/AdminDashboard"));
const FindVoterId      = lazy(() => import("../pages/FindVoterId"));
const ElectionNews     = lazy(() => import("../pages/news/ElectionNews"));
const Results          = lazy(() => import("../pages/Results"));
const CandidateProfile = lazy(() => import("../pages/candidate/CandidateProfile"));

const Fallback = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "#9ca3af" }}>
        Loading...
    </div>
);

const wrap = (el) => <Suspense fallback={<Fallback />}>{el}</Suspense>;

export let router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true,                 element: <Home /> },
            { path: "/register",           element: wrap(<Signup />) },
            { path: "/find-voter-id",      element: wrap(<FindVoterId />) },
            { path: "/login",              element: wrap(<Login />) },
            { path: "/news",               element: wrap(<ElectionNews />) },
            { path: "/results",            element: wrap(<Results />) },
            { path: "/candidate/:partyId", element: wrap(<CandidateProfile />) },
            {
                path: "/profile",
                element: (
                    <UserPrivate>
                        {wrap(<Profile />)}
                    </UserPrivate>
                ),
            },
            { path: "/adminDashbord", element: wrap(<AdminDashboard />) },
        ],
    },
]);
