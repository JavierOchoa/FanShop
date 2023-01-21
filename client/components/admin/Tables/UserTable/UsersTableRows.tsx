import { FC, PropsWithChildren } from "react";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import { ModalType, User } from "../../../../interfaces";

interface Props {
  isItemSelected: boolean;
  user: User;
  handleClick: (id: string) => void;
  handleOpenEditDialog: (type: ModalType, id: string) => void;
}

export const UsersTableRows: FC<PropsWithChildren<Props>> = ({
  isItemSelected,
  user,
  handleClick,
  handleOpenEditDialog,
}) => {
  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={user.id}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          onChange={() => handleClick(user.id)}
          inputProps={{
            "aria-labelledby": `enhanced-table-checkbox-${user.id}`,
          }}
        />
      </TableCell>
      <TableCell
        component="th"
        id={`enhanced-table-checkbox-${user.id}`}
        scope="user"
        padding="none"
        onClick={() => handleOpenEditDialog("edit", user.id)}
      >
        {user.fullName}
      </TableCell>
      <TableCell align="right">{user.email}</TableCell>
      <TableCell align="right">{user.roles.join(", ")}</TableCell>
      <TableCell align="right">{user.isActive ? "true" : "false"}</TableCell>
    </TableRow>
  );
};
