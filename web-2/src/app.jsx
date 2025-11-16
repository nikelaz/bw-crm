import { Switch, Route } from "wouter";

// Routes
import Login from "./routes/login";
import Dashboard from "./routes/dashboard";
import Contacts from "./routes/contacts";
import Emails from "./routes/emails";
import EmailTemplates from "./routes/email-templates";
import EmailSend from "./routes/email-send";
import NotFound from "./routes/not-found";

// Styles
import "normalize.css/normalize.css"
import "@progress/kendo-theme-bootstrap/dist/all.css";
import "./index.css";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/emails" component={Emails} />
      <Route path="/emails/templates" component={EmailTemplates} />
      <Route path="/emails/send" component={EmailSend} />
      <Route component={NotFound} />
    </Switch>
  );
}
