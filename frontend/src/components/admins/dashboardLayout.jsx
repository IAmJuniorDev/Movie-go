import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieEditIcon from "@mui/icons-material/MovieEdit";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import DashboardPage from "views/admins/dashboard";
import MovieEdit from "views/admins/movie-edit";
import theme from "utils/theme/theme";
import { useTheme } from "@mui/material";

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
  const theme2 = useTheme();
  const color = theme2.palette;
  const router = useCustomRouter();
  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={theme}>
      <DashboardLayout>
        <PageContainer
          className="testKub"
          sx={{
            backgroundColor: theme2 === "dark"?color.background.default:"",
          }}
        >
          <Grid container spacing={1}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/user" eleement={<DashboardPage />} />
              <Route path="/movie" element={<MovieEdit />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
