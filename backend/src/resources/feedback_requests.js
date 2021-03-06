import resource from 'resource-router-middleware';
import FeedbackRequest from '../models/feedback_request';
import User from '../models/user';
import UserGroup from '../models/user_groups';
import {failure} from '../lib/util';

export default ({config, db}) => resource({

  id: 'feedbackreq',

  // Preloads resource for requests with :id placeholder
  async load(req, id, callback) {
    const feedbackreq = await FeedbackRequest.findOne({_id: id}).populate('author').populate('user').populate('userGroup');
    const err = feedbackreq ? null : '404';

    callback(err, feedbackreq);
  },

  // GET / - List all entities (opt filter ?author={} &username={} &userGroupname={})
  async list(req, res) {

    let searchParams = {};
    if (req.query.author) {
      const persistedAuthor = await User.findOne({username: req.query.author});

      if (!persistedAuthor) {
        res.json({});
        return;
      }

      searchParams = {author: persistedAuthor._id};
    }

    if (req.query.userGroupname) {
      const persistedUserGroup = await UserGroup.findOne({userGroupname: req.query.userGroupname});

      if (!persistedUserGroup) {
        res.json({});
        return;
      }

      searchParams = {userGroup: persistedUserGroup._id};
    } else if (req.query.username) {
      const persistedUser = await User.findOne({username: req.query.username});

      if (!persistedUser) {
        res.json({});
        return;
      }

      searchParams = {user: persistedUser._id};
    }

    const reports = await FeedbackRequest.find(searchParams).populate('author').populate('user').populate('userGroup');
    res.json(reports);
  },

  // GET /:id - Return a given entity
  async read({feedbackreq}, res) {
    res.json(feedbackreq);
  },

  // POST / - Create a new entity
  async create({body}, res) {
    let {author, username, userGroupname} = body;

    if (author === username) {
      failure(res, "Requesting feedback on yourself is not allowed", 400);
      return;
    }

    const persistedAdresser = await User.findOne({username: author});
    if (!persistedAdresser) {
      failure(res, "No user (author) found with given username", 404);
      return;
    }

    const persistedUser = await User.findOne({username: username});
    const persistedGroup = await UserGroup.findOne({userGroupname: userGroupname});

    if (!persistedUser && !persistedGroup) {
      failure(res, "No user or userGroup (adressees) found with given username/userGroupname", 404);
      return;
    }

    const newFeedbackRequestData = {author: persistedAdresser._id};
    if (persistedUser)
      newFeedbackRequestData['user'] = persistedUser._id;
    else if (persistedGroup)
      newFeedbackRequestData['userGroup'] = persistedGroup._id;

    const persistedFeedbackRequest = await new FeedbackRequest(newFeedbackRequestData).save();

    res.status(200).send(persistedFeedbackRequest);
  },

  // DELETE /:id - Delete a given entity
  async delete({feedbackreq}, res) {
    await FeedbackRequest.remove(feedbackreq);
    res.sendStatus(202);
  }
});
