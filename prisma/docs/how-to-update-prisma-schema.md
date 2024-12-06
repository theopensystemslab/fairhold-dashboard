## How to update Fairhold's Prisma schema

This guide explains how we can update our Prisma schema and manage migrations to the production database. This highlights the steps we need to take within this repo, for a wider primer please see the Prisma docs: https://www.prisma.io/docs/orm/prisma-migrate


1. Update `schema.prisma`
Make a change to this file which describes the change you would like to make (e.g. add column, add table).

2. Generate migration
Run `npm run prisma:migrate` - this will apply to the change to your local dev database, and generate a migration file in `/prisma/migrations`

> [!TIP]
> The command `npm run prisma:migrate-create-only` will generate a migration file without running it. This is helpful if you want to add any additional changes, and manually configure the migration. For example when renaming a column Prisma may drop and recreate (thus losing data). Manually generating an `ALTER table UPDATE column` SQL command allows us to work around this. You'll then need to run `npm run prisma:migrate` to apply your changes.
>
> Docs: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production#customizing-migrations

3. Update Prisma client
Run `npm run prisma:generate` to update your local client. You should now be able to both interact with the updated Prisma client as well as view the change in your local dev database.

4. Open PR, merge to `main`
From here, we can open the changes up to peer-review on GitHub. Once approved and merged, CI will apply our new migration to the production database using the "Deploy migrations" action (dir: `/.github/workflows/deploy-migrations.yaml`).

