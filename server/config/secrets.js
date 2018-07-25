/** Important **/
/** You should not be committing this file to GitHub **/
/** Repeat: DO! NOT! COMMIT! THIS! FILE! TO! YOUR! REPO! **/

module.exports = {
  // Find the appropriate database to connect to, default to localhost if not found.
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/ReactWebpackNode',
  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',
  google: {
    clientID: process.env.GOOGLE_CLIENTID || '62351010161-eqcnoa340ki5ekb9gvids4ksgqt9hf48.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '6cKCWD75gHgzCvM4VQyR5_TU',
    callbackURL: process.env.GOOGLE_CALLBACK || "/auth/google/callback"
  },
  twitter: {
    api_key: 'o0IvmL8wa7vYXsLgoQS6WZm6B',
    api_secret_key: 'xLJ1o6b0PPuDwR7hwEu4SqzRFNrasSWmNnaXna4el9XI23swdn',
    // id: '1021635598921035776',
    // token: '1021635598921035776-zu4u8UAytlGIMrrfFjV6CBumpEykKe',
    // token_secret_key: 'EyCwi0EwfdPKON2HdViK7T0YWIcnj218ahDX4Z9Oj1VD2',
    callback: 'http://localhost:8080/home'
  }
};
