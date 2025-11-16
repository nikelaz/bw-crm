import { useLocation } from "wouter";
import { useStore } from "../store";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Drawer,
  DrawerContent
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import Container from "./container";
import AuthGate from "./auth-gate";
import {
  envelopeIcon,
  dashboardSolidIcon,
  userIcon,
  logoutIcon,
  listUnorderedOutlineIcon,
} from "@progress/kendo-svg-icons";

const items = [
  {
    text: "Dashboard",
    svgIcon: dashboardSolidIcon,
    route: "/dashboard",
  },
  {
    text: "Contacts",
    svgIcon: userIcon,
    route: "/contacts",
  },
  {
    text: "Lists",
    svgIcon: listUnorderedOutlineIcon,
    route: "/lists",
  },
  {
    text: "Emails",
    svgIcon: envelopeIcon,
    route: "/emails",
  },
  {
    text: "Pipeline",
    route: "/pipeline",
  },
];

const styles = {
  root: {
    height: "100vh",
  },
  drawer: {
    height: "calc(100% - 4rem)",
  },
  appBar: {
    minHeight: "4rem",
    boxShadow: "none",
    borderBottom: "1px solid var(--kendo-color-border)",
  },
  main: {
    height: "100%",
    overflow: "auto",
  }
};

export default function MainLayout(props) {
  const [location, navigate] = useLocation();
  const logout = useStore(store => store.logout);

  const handleSelect = (e) => {
    navigate(e.itemTarget.props.route);
  };

  const itemsWithSelected = items.map(item => ({
    ...item,
    selected: location.startsWith(item.route),
  }));

  return (
    <AuthGate>
      <div style={styles.root}>
        <AppBar style={styles.appBar}>
          <AppBarSection>
            <div>BW CRM</div>
          </AppBarSection>
          <AppBarSpacer />
          <AppBarSection>
            <Button
              fillMode="flat"
              type="button"
              svgIcon={logoutIcon}
              onClick={logout}
            >
              Logout
            </Button>
          </AppBarSection>
        </AppBar>
        <Drawer
          expanded={true}
          position="start"
          mode="push"
          items={itemsWithSelected}
          style={styles.drawer}
          onSelect={handleSelect}
        >
          <DrawerContent style={styles.main}>
            <Container>
              {props.children}
            </Container>
          </DrawerContent>
        </Drawer>
      </div>
    </AuthGate>
  );
}
