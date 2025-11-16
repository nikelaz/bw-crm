// @Todo: These should be CSS variables
const NAV_HEIGHT_REM = 4;
const PADDING_REM = 1.75;
const HEADER_HEIGHT_REM = 3;
const BODY_HEIGHT_REM = NAV_HEIGHT_REM + (PADDING_REM * 3) + HEADER_HEIGHT_REM;

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: `${PADDING_REM}rem`,
  },
  header: {
    display: "flex",
    minHeight: `${HEADER_HEIGHT_REM}rem`,
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    height: `calc(100vh - ${BODY_HEIGHT_REM}rem)`,
  },
};

export function ListLayout(props) {
  return (
    <div style={styles.root}>
      {props.children}
    </div>
  )
}

export function ListLayoutHeader(props) {
  return (
    <header style={styles.header}>
      {props.children}
    </header>
  );
}

export function ListLayoutBody(props) {
  return (
    <main style={styles.body}>
      {props.children}
    </main>
  );
}
