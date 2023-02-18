import { useUpdateUserMutation, useDeactivateRequestUserMutation } from "../../redux/services";
import { UpdateAccount } from "../../interfaces";
import { updateEmail, updateName } from "../../redux/slices";
import { useAppDispatch } from "./index";
import useAuth from "./useAuth";

export default function useUser() {
  const dispatch = useAppDispatch();
  const { userLogout } = useAuth();

  const [updateUserMutation] = useUpdateUserMutation();
  const [deactivateUserMutation] = useDeactivateRequestUserMutation();

  const updateUser = async (objToUpdate: UpdateAccount) => {
    const { fullName, email } = objToUpdate;
    try {
      const updateResponse = await updateUserMutation(objToUpdate).unwrap();
      if (updateResponse.successful) {
        if (fullName) {
          dispatch(updateName(fullName));
        }
        if (email) {
          dispatch(updateEmail(email));
        }
      }
      return updateResponse;
    } catch (e) {
      return {
        successful: false,
        message: (e as Error).message,
      };
    }
  };

  const deactivateUser = async (password: string) => {
    try {
      const deactivationResponse = await deactivateUserMutation(password).unwrap();
      if (deactivationResponse.successful) {
        userLogout();
      }
      return deactivationResponse;
    } catch (e) {
      return {
        successful: false,
        message: (e as Error).message,
      };
    }
  };

  return {
    updateUser,
    deactivateUser,
  };
}
