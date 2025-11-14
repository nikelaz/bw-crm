import MainLayout from "./components/main-layout";
import { Switch, Route } from "wouter";

// Routes
import Dashboard from "./routes/dashboard";
import Users from "./routes/users";
import Email from "./routes/email";
import NotFound from "./routes/not-found";

// Styles
import "normalize.css/normalize.css"
import "@progress/kendo-theme-bootstrap/dist/all.css";
import "./index.css";

export default function App() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/users" component={Users} />
        <Route path="/email" component={Email} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}
