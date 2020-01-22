// sessionRef = FirebaseFirestore.CollectionReference
module.exports = (sessionRef, opts) => {
  const options = {
    property: 'session',
    getSessionKey: (ctx) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`,
    ...opts,
  };

  async function getSession(key) {
    const sessionSnapshot = await sessionRef
      .doc(key)
      .get();
    return sessionSnapshot.data();
  }

  function saveSession(key, session) {
    if (!session || Object.keys(session).length === 0) {
      return sessionRef.doc(key).delete();
    }
    // Removing custom prototypes on anything attached to session, else firestore rejects this
    const serializedSession = JSON.parse(JSON.stringify(session));
    return sessionRef.doc(key).set(serializedSession);
  }

  return async (ctx, next) => {
    const key = options.getSessionKey(ctx);
    if (!key) {
      return next();
    }
    return getSession(key).then((value) => {
      let session = value || {};
      Object.defineProperty(ctx, options.property, {
        get() {
          return session;
        },
        set(newValue) {
          session = { ...newValue };
        },
      });
      return next().then(() => saveSession(key, session));
    });
  };
};
