import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
// import { useState } from "react";
// import requests from "../../api/requests";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useLocation, useNavigate } from "react-router";
import { loginUser } from "./accountSlice";
import { useAppDispatch } from "../../store/store";
import { getCart } from "../cart/cartSlice";

export default function LoginPage() {
  // const [username, SetUsername] = useState("");
  // const [password, SetPassword] = useState("");

  // const [values, setValues] = useState({
  //   username: "",
  //   password: "",
  // });

  // function handleSubmit(e: any) {
  //   e.preventDefault();
  //   console.log(values);
  //   requests.Account.login(values);
  // }

  // function handleInputChange(e: any) {
  //   const { name, value } = e.target;
  //   setValues({ ...values, [name]: value }); // { username: "abc", password: "123" }
  // }

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function submitForm(data: FieldValues) {
    await dispatch(loginUser(data));
    await dispatch(getCart());
    navigate(location.state?.from || "/catalog");
  }

  return (
    <Container maxWidth="xs">
      <Paper sx={{ marginTop: 8, padding: 2 }} elevation={3}>
        <Avatar
          sx={{
            mx: "auto",
            color: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{ mt: 2 }}
        >
          <TextField
            {...register("username", { required: "username is required" })}
            // name="username"
            label="Enter username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            size="small"
            error={!!errors.username}
            helperText={errors.username?.message}
          ></TextField>

          <TextField
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 6,
                message: "Min length is 6 characters",
              },
            })}
            // name="password"
            label="Enter password"
            type="password"
            fullWidth
            required
            sx={{ mb: 2 }}
            size="small"
            error={!!errors.password}
            helperText={errors.password?.message}
          ></TextField>

          <LoadingButton
            loading={isSubmitting}
            disabled={!isValid}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            Login
          </LoadingButton>
        </Box>
      </Paper>
    </Container>
  );
}
