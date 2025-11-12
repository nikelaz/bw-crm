import {
  MantineProvider,
  AppShell,
  Container,
} from "@mantine/core";
import { Switch, Route } from "wouter";
import Nav from "./components/nav";
import Dashboard from "./routes/dashboard";
import Users from "./routes/users";
import Email from "./routes/email";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";

export default function App() {
  return (
    <MantineProvider>
      <AppShell
        padding="md"
        navbar={{
          width: 300,
        }}
      >
        <AppShell.Navbar>
          <Nav />
        </AppShell.Navbar>
        <AppShell.Main>
          <Container>
            <Switch>
              <Route path="/users" component={Users} />
              <Route path="/email" component={Email} />
              <Route path="/" component={Dashboard} />
              <Route>Page Not Found</Route>
            </Switch>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
