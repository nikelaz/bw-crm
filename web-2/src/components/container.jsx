const styles = {
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "1.75rem",
  },
};

export default function Container(props) {
  return (
    <div style={styles.container}>
      {props.children}
    </div>
  )
}
