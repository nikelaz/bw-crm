const styles = {
  container: {
    maxWidth: "960px",
    margin: "0 auto",
  },
};

export default function Container(props) {
  return (
    <div style={styles.container}>
      {props.children}
    </div>
  )
}
