# Budget Warden CRM

A proprietary, super-simple CRM system.

## Environment Variables

The system depends on the following environment variables:

```
//.env
PORT=<port-number>
JWT_SECRET=<secret-string>
POSTGRES_URL=postgres://<username>:<password>@<host>/<database>
ADMIN_USERNAME=<username>
ADMIN_PASSWORD=<password>
```

## Postbuild Script

After creating a release build, run the postbuild script to copy the web folder.

```
cargo build --release
cargo run --bin postbuild
```

You will also need to create an empty database in the target release folder manually if you're making a first deployment.

```
touch crm.db
```

And don't forget to add the `.env` file there as well. Check the environment variables section above for the required variables.
