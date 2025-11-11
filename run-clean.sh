#!/bin/bash
cargo build --release
cargo run --bin postbuild
(
  cd ./target/release
  rm ./crm.db
  touch crm.db
  ./bw-crm
)
