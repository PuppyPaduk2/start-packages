function take(moduleRequire) {
  return (id, def = undefined) => {
    try {
      return moduleRequire(id);
    } catch {
      return def;
    }
  };
}

module.exports = take;
