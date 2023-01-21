import { FC } from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useRouter } from "next/router";

export const AdminDrawer: FC = () => {
  const router = useRouter();
  const handleListItem = (pageName: string | undefined) => {
    if (pageName) {
      router.push(`/admin/${pageName.toLowerCase()}`);
    } else {
      router.push(`/admin/`);
    }
  };
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
          {["Stats", "Products", "Users"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleListItem(text === "Stats" ? undefined : text)}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
