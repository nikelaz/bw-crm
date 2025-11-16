import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "../store";
import { FormLayout, FormField } from "../components/forms";
import { TextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Error } from "@progress/kendo-react-labels";
import { Card, CardHeader, CardTitle, CardBody } from "@progress/kendo-react-layout"; 
import MinimalLayout from "../components/minimal-layout";

function requiredValidator(input, fieldTitle) {
  if (!input) {
    return `${fieldTitle} is required.`;
  }

  return "";
}


export default function Login() {
  const [_, navigate] = useLocation();
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const login = useStore(store => store.login);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const username = formData.get("username");
    const password = formData.get("password");

    setUsernameError(requiredValidator(username, "Username"));
    setPasswordError(requiredValidator(password, "Password")); 

    login(username, password);

    navigate("/dashboard");
  };

  return (
    <MinimalLayout>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <FormLayout>
              <FormField label="Username" editorId="username" error={usernameError}> 
                <TextBox required name="username" id="username" />
              </FormField>
              <FormField label="Password" editorId="password" error={passwordError}>
                <TextBox required name="password" type="password" id="password" />
              </FormField>
              <Button themeColor="primary" type="submit">
                Sign In
              </Button>
              <Error>{formError}</Error>
            </FormLayout>
          </form>
        </CardBody>
      </Card>
    </MinimalLayout>
  );
};
