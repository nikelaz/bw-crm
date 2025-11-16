const styles = {
  container: {
    padding: "1.75rem",
    height: "100%",
  },
};

export default function Container(props) {
  return (
    <div style={styles.container}>
      {props.children}
    </div>
  )
}
