# Start Devnet Container

- Starts a Devnet provider
- Optionally perform a few aditional migrations

## Examples

#### Typical Use Case

```yaml
  - name: Start devnet
        uses: ./.github/actions/devnet
        with:
          migrations: packages/apps/graph/cwd-extra-migrations
```
