import resource from 'resource-router-middleware';
import Report from '../models/report';
import User from '../models/user';
import UserGroup from '../models/user_groups';
import {failure} from '../lib/util';

export default ({config, db}) => resource({

  id: 'report',

  // Preloads resource for requests with :id placeholder
  async load(req, id, callback) {
    const report = await Report.findOne({_id: id}).populate('user').populate('userGroup');
    const err = report ? null : '404';

    callback(err, report);
  },

  // GET / - List all entities
  async list({}, res) {
    const reports = await Report.find();
    res.json(reports);
  },

  // GET /:id - Return a given entity
  async read({report}, res) {
    res.json(report);
  },

  // POST / - Create a new entity
  async create({body}, res) {
    let {username, userGroupname, document} = body;

    const persistedUser = await User.findOne({username: username});
    const persistedGroup = await UserGroup.findOne({userGroupname: userGroupname});

    if (!persistedUser && !persistedGroup) {
      failure(res, "No user or userGroup found with given username/userGroupname", 404);
      return;
    }

    const newReportData = {document: document};
    if (persistedUser)
      newReportData['user'] = persistedUser._id;
    else if (persistedGroup)
      newReportData['userGroup'] = persistedGroup._id;

    const persistedReport = await new Report(newReportData).save();

    res.status(200).send(persistedReport);
  },

  // DELETE /:id - Delete a given entity
  async delete({report}, res) {
    await Report.remove(report);
    res.sendStatus(202);
  }
});
