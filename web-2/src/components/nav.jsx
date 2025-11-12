import {
  IconLayoutDashboard,
  IconUsers,
  IconMail,
  IconLogout,
} from "@tabler/icons-react";
import { Text } from "@mantine/core";
import { Link } from "wouter";
import classes from "./nav.module.css";

const tabs = [
  { link: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { link: "/users", label: "Users", icon: IconUsers },
  { link: "/email", label: "Email", icon: IconMail },
];

export default function Nav() {
  const links = tabs.map((item) => (
    <Link
      className={(active) => (active ? `${classes.link} ${classes.linkActive}` : classes.link)}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <Text fw={600} size="lg">
        BW CRM
      </Text>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
