import { Box, useTheme } from "@mui/material";
import { Text } from "libs/text";


const DashboardPage = ()=>{
  const theme = useTheme();
  const color = theme.palette;
  return(
    <Box>
      <Text variant="h1" color={color.warning.main}>h1</Text>
      <Text variant="h2">h2</Text>
      <Text variant="h3">h3</Text>
      <Text variant="h4">h4</Text>
      <Text variant="h5">h5</Text>
      <Text variant="h6">h6</Text>
      <Text variant="subtitle1">subtitle1</Text>
      <Text variant="subtitle2">subtitle2</Text>
      <Text variant="body1">body1</Text>
      <Text variant="body2">body2</Text>
      <Text variant="caption">caption</Text>
    </Box>
  ) 
}

export default DashboardPage;