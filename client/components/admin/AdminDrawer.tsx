import { FC, PropsWithChildren } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

export const AdminDrawer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
      }}
    >
      <Toolbar />
      <Box>
        <List>
          {["Stats", "Products"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
