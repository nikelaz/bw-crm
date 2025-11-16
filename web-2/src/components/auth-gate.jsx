import { useStore } from "../store";
import { useLocation } from "wouter";

export default function AuthGate(props) {
  const token = useStore(state => state.token);
  const [route, navigate] = useLocation();

  if (!token && route !== "/") {
    navigate("/");
    return null;
  }

  if (token && route === "/login") {
    navigate("/dashboard");
    return null;
  }

  return props.children;
}
