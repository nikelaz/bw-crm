import { Typography } from "@progress/kendo-react-common";

const styles = {
  title: {
    fontSize: "1.75rem",
    marginBottom: 0,
  }
};

export default function PageTitle(props) {
  return (
    <Typography.h1 style={styles.title}>
      {props.children}
    </Typography.h1>
  );
}
