'use strict';
// Production specific configuration
// =================================
module.exports = {
  sequelize: {
      uri:  'postgres://lwozoamkfudbwv:4616538fd1f716a17d284dce879009e1e0301b1df917ceb999c2219d962a9bb8@ec2-23-21-216-174.compute-1.amazonaws.com:5432/d605knddomk6qm',
      options: {
        logging: false,
        dialect: 'postgres',
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true,
        },
        dialectOptions: {
              ssl: true
          }
    }
  }
};
