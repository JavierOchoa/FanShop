import React, { useState } from "react";
import { TableComponent, UserDialog } from "../../components/admin/";
import { ModalType, TableHeadCell } from "../../interfaces";
import { AdminLayout } from "../../layouts";
import { useGetUsersQuery } from "../../redux/services";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { changeOpenEditDialogStatus, changeDialogType } from "./../../redux/slices/productSlice";

export default function AdminUser() {
  const dispatch = useAppDispatch();
  const { data: userList } = useGetUsersQuery();
  const openEditDialog = useAppSelector((state) => state.products.openEditDialog);
  const [detailedUser, setDetailedUser] = useState<string | undefined>(undefined);
  const modalType = useAppSelector((state) => state.products.dialogType);
  const headCells: TableHeadCell[] = [
    {
      id: "fullName",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "roles",
      numeric: false,
      disablePadding: false,
      label: "Roles",
    },
    {
      id: "isActive",
      numeric: true,
      disablePadding: false,
      label: "Active",
    },
  ];

  const handleOpenEditDialog = async (dialogType: ModalType, userId?: string) => {
    if (userId) {
      setDetailedUser(userId);
    }
    dispatch(changeDialogType(dialogType));
    dispatch(changeOpenEditDialogStatus());
  };

  return (
    <AdminLayout title={"Users"} pageDescription={"User list in Admin Panel"}>
      <TableComponent
        tableTitle={"User list"}
        elements={userList}
        handleOpenEditDialog={handleOpenEditDialog}
        headCells={headCells}
        initialRowsPerPage={15}
        tableType={"user"}
      />
      <UserDialog userId={detailedUser} openStatus={openEditDialog} dialogType={modalType} />
    </AdminLayout>
  );
}
