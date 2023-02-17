import { Box, Tab, Tabs } from "@mui/material";
import React, { SyntheticEvent, useState } from "react";
import { Account } from "./Account";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box width={800} height={500} sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const pages = ["Account", "Orders"];
export const DashboardTabs = () => {
  const [value, setValue] = useState(0);
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 524, mt: 2 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "primary" }}
      >
        {pages.map((page) => {
          return <Tab key={page} label={page.toUpperCase()} />;
        })}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Account />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </Box>
  );
};
