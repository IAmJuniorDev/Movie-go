import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieEditIcon from "@mui/icons-material/MovieEdit";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import DashboardPage from "views/admins/dashboard";
import MovieEdit from "views/admins/movie-edit";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  // {
  //   segment: 'orders',
  //   title: 'Orders',
  //   icon: <ShoppingCartIcon />,
  // },
  // {
  //   kind: 'divider',
  // },
  // {
  //   kind: 'header',
  //   title: 'Display',
  // },
  // {
  //   segment: 'reports',
  //   title: 'Reports',
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: 'sales',
  //       title: 'Sales',
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: 'traffic',
  //       title: 'Traffic',
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment:'user-display',
  //   title:'User Display',
  //   icon: <PeopleIcon />
  // },
  // {
  //   segment: 'movie-display',
  //   title: 'Movies Display',
  //   icon: <MovieIcon />,
  // },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Manage",
  },
  // {
  //   segment: "user",
  //   title: "User",
  //   icon: <ManageAccountsIcon />,
  // },
  {
    segment: "movie",
    title: "Movie",
    icon: <MovieEditIcon />,
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1440,
    },
  },
});

function useCustomRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    pathname: location.pathname.replace("/admin", "") || "/",
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(`/admin${path === "/" ? "" : path}`),
  };
}

export default function DashboardLayoutBasic() {
  const router = useCustomRouter();

  return (
    <ThemeProvider theme={demoTheme}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
      >
        <DashboardLayout>
          <PageContainer>
            <Grid container spacing={1}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/user" eleement={<DashboardPage/>} />
                <Route path="/movie" element={<MovieEdit />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Grid>
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}