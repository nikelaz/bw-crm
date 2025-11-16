#!/bin/bash
cargo build --release
(
  cd ./web-2
  npm run build
)
cargo run --bin postbuild
(
  cd ./target/release
  rm ./crm.db
  touch crm.db
  ./bw-crm
)
