import { Switch, Route } from "wouter";

// Routes
import Login from "./routes/login";
import Dashboard from "./routes/dashboard";
import Contacts from "./routes/contacts";
import Lists from "./routes/lists";
import Emails from "./routes/emails";
import EmailTemplates from "./routes/email-templates";
import EmailTemplateSend from "./routes/email-template-send";
import EmailSend from "./routes/email-send";
import LeadsBoard from "./routes/leads-board";
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
      <Route path="/lists" component={Lists} />
      <Route path="/emails" component={Emails} />
      <Route path="/emails/templates" component={EmailTemplates} />
      <Route path="/emails/send-template" component={EmailTemplateSend} />
      <Route path="/emails/send" component={EmailSend} />
      <Route path="/leads-board" component={LeadsBoard} />
      <Route component={NotFound} />
    </Switch>
  );
}
