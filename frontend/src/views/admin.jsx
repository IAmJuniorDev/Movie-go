import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import MovieEditIcon from '@mui/icons-material/MovieEdit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardPage from './admins/dashboard';
import MovieEdit from './admins/movie-edit';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
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
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Manage',
  },
  {
    segment:'user-edit',
    title:'User Edit',
    icon: <ManageAccountsIcon />
  },
  {
    segment: 'movie-edit',
    title: 'Movie Edit',
    icon: <MovieEditIcon />,
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
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

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter("/dashboard");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            {router.pathname === '/dashboard' && <DashboardPage />}
            {router.pathname === '/user-edit' && <DashboardPage />}
            {router.pathname === '/movie-edit' && <MovieEdit />}
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}


// import React, { useState } from "react";
// import "../styles/admin.css";
// import { publicRequest } from "../axiosCall.js";

// const Admin = () => {
//   const [id, setId] = useState("");
//   const [vImage, setVImage] = useState("");
//   const [hImage, setHImage] = useState("");

//   const handleVImageChange = (e) => {
//     setVImage(e.target.files[0]); // Store the file object
//   };

//   const handleHImageChange = (e) => {
//     setHImage(e.target.files[0]); // Store the file object
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!id || !vImage || !hImage) {
//       alert("Please provide all fields!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image_v", vImage);
//     formData.append("image_h", hImage);

//     try {
//       const res = await publicRequest.put(`/movies/addpic/${id}`, formData);

//       if (res.status === 200) {
//         alert("Update successful!");
//       } else {
//         alert("Error occurred while updating.");
//       }
//     } catch (error) {
//       console.error("Error during upload:", error);
//       alert("Error during upload.");
//     }
//   };
//   return (
//     <div className="admin-container">
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="imdbID"
//           onChange={(e) => setId(e.target.value)}
//           value={id}
//         />
//         <p>Vertical Image</p>
//         <input type="file" onChange={handleVImageChange} />
//         <p>Horizontal Image</p>
//         <input type="file" onChange={handleHImageChange} />
//         <button type="submit">update</button>
//       </form>
//       <hr />
//       <hr />
//     </div>
//   );
// };

// export default Admin;
