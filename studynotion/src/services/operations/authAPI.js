import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlices"
import { resetCart } from "../../slices/cartSlices"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints

// Helper function to handle API requests and loading state
const handleApiRequest = async (dispatch, apiFunction, payload, successMessage, errorMessage) => {
  const toastId = toast.loading("Loading...")
  dispatch(setLoading(true))
  try {
    const response = await apiFunction(payload)
    console.log(`${apiFunction.name} API RESPONSE:`, response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success(successMessage)
    return response.data
  } catch (error) {
    console.error(`${apiFunction.name} API ERROR:`, error)
    toast.error(errorMessage || "Something went wrong")
    throw error
  } finally {
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    try {
      const response = await handleApiRequest(
        dispatch,
        (payload) => apiConnector("POST", SENDOTP_API, payload),
        { email, checkUserPresent: true },
        "OTP Sent Successfully"
      )
      navigate("/verify-email")
    } catch (error) {
      toast.error("Could Not Send OTP")
    }
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    try {
      const response = await handleApiRequest(
        dispatch,
        (payload) => apiConnector("POST", SIGNUP_API, payload),
        { accountType, firstName, lastName, email, password, confirmPassword, otp },
        "Signup Successful"
      )
      navigate("/login")
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Signup Failed"
      toast.error(`Signup Failed: ${errorMessage}`)
      navigate("/signup")
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    try {
      const response = await handleApiRequest(
        dispatch,
        (payload) => apiConnector("POST", LOGIN_API, payload),
        { email, password },
        "Login Successful"
      )

      dispatch(setToken(response.token))
      const userImage = response.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${response.user.firstName} ${response.user.lastName}`
      dispatch(setUser({ ...response.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(response.token))
      localStorage.setItem("user", JSON.stringify(response.user))
      navigate("/dashboard/my-profile")
    } catch (error) {
      toast.error("Login Failed")
    }
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Make sure the API request includes the correct email parameter
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email: email.trim(),
      });

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
}



export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    try {
      const response = await handleApiRequest(
        dispatch,
        (payload) => apiConnector("POST", RESETPASSWORD_API, payload),
        { password, confirmPassword, token },
        "Password has been reset successfully"
      )
    } catch (error) {
      toast.error("Unable to reset password")
    }
  }
}
