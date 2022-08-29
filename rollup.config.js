const path = require("path")
const lwcRollupPlugin = require("@lwc/rollup-plugin")
const replace = require("rollup-plugin-replace")
const rollupNodeResolver = require("rollup-plugin-node-resolve")

const env = process.env.NODE_ENV || "development"

const input = path.resolve(__dirname, "src/app.js")

function rollupConfig() {
  return {
    input,
    output: {
      format: "esm",
      dir: path.resolve(__dirname, "dist")
    },
    plugins: [
      lwcRollupPlugin({
        modules: [
          {npm: "@salesforce-ux/design-system"},
          {npm: "lightning-base-components"}
        ],
        stylesheetConfig: {
          customProperties: {allowDefinition: true}
        }
      }),
      rollupNodeResolver(),
      replace({
        "process.env.NODE_ENV": JSON.stringify(env)
      })
    ].filter(Boolean),
    watch: {
      exclude: ["node_modules/**"]
    },
    preserveEntrySignatures: "false"
  }
}

module.exports = [rollupConfig()]
