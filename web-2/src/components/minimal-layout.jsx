import AuthGate from "./auth-gate";

const styles = {
  minLayoutContainer: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.75rem",
  }
};

export default function MinimalLayout(props) {
  return (
    <AuthGate>
      <div style={styles.minLayoutContainer}>
        {props.children}
      </div>
    </AuthGate>
  );
}
