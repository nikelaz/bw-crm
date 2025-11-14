import { useState } from "react";
import { useLocation } from "wouter";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import Container from "./container";
import {
  envelopeIcon,
  dashboardSolidIcon,
  userIcon
} from "@progress/kendo-svg-icons";

const items = [
  {
    text: "Dashboard",
    svgIcon: dashboardSolidIcon,
    route: "/",
  },
  {
    text: "Users",
    svgIcon: userIcon,
    route: "/users",
  },
  {
    text: "Email",
    svgIcon: envelopeIcon,
    route: "/email",
  },
];

export default function MainLayout(props) {
  const [selected, setSelected] = useState("/");
  const [_, navigate] = useLocation();

  const handleSelect = (e) => {
    const route = e.itemTarget.props.route;
    navigate(route);
    setSelected(route);
  };

  const itemsWithSelected = items.map(item => ({
    ...item,
    selected: item.route === selected,
  }));

  return (
    <Drawer
      expanded={true}
      position={'start'}
      mode={'push'}
      items={itemsWithSelected}
      style={{ height: '100vh' }}
      onSelect={handleSelect}
    >
      <DrawerContent>
        <Container>
          {props.children}
        </Container>
      </DrawerContent>
    </Drawer>
  );
}
