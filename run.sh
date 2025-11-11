#!/bin/bash
cargo build --release
cargo run --bin postbuild
(
  cd ./target/release
  ./bw-crm
)
