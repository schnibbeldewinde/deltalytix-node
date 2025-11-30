// Ensure single-node replica set is initialized with a reachable host for other containers
const targetHost = process.env.MONGO_REPLICA_HOST || "mongo:27017"

try {
  const config = rs.conf()
  const needsUpdate = config.members.some((member) => member.host !== targetHost)

  if (needsUpdate) {
    config.members = config.members.map((member) =>
      Object.assign({}, member, { host: targetHost }),
    )
    rs.reconfig(config, { force: true })
    print(`[mongo-init] Updated replica set host to ${targetHost}`)
  } else {
    print(`[mongo-init] Replica set already configured for ${targetHost}`)
  }
} catch (e) {
  if (e.codeName === "NotYetInitialized") {
    rs.initiate({
      _id: "rs0",
      members: [{ _id: 0, host: targetHost }],
    })
    print(`[mongo-init] Replica set initiated with host ${targetHost}`)
  } else {
    print(`[mongo-init] Failed to verify replica set: ${e}`)
    quit(1)
  }
}
