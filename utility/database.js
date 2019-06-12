const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../modules/users/model');
const Campaign = require('../modules/campaigns/model');
const Adventure = require('../modules/adventures/model');
const Character = require('../modules/characters/model');
const Npc = require('../modules/npcs/model')

const models = { User, Campaign, Adventure, Character, Npc };

const connectDb = () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(process.env.DATABASE_URL);
};

const eraseDatabaseOnSync = true;

const initializeDb = async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Campaign.deleteMany({}),
      models.Adventure.deleteMany({}),
      models.Character.deleteMany({}),
      models.Npc.deleteMany({}),
    ]);

    const user1 = new models.User({
      username: 'master-user@gmail.com',
      password: await bcrypt.hash('password', 10),
    });
    await user1.save();

    const campaign1 = new models.Campaign({
      user: user1.id,
      name: 'Campagna 1',
      description: 'Descrizione campagna 1',
    });
    await campaign1.save();

    const campaign2 = new models.Campaign({
      user: user1.id,
      name: 'Campagna 2',
      description: 'Descrizione campagna 2',
    });
    await campaign2.save();

    const adventure1 = new models.Adventure({
      campaign: campaign1.id,
      name: 'Avventura 1',
      description: 'Descrizione avventura 1',
      levelRange: '1 - 3',
    });
    await adventure1.save();

    const adventure2 = new models.Adventure({
      campaign: campaign1.id,
      name: 'Avventura 2',
      description: 'Descrizione avventura 21',
      levelRange: '3 - 5',
    });
    await adventure2.save();

    const adventure3 = new models.Adventure({
      campaign: campaign1.id,
      name: 'Avventura 3',
      description: 'Descrizione avventura 3',
      levelRange: '5 - 8',
    });
    await adventure3.save();

    const adventure4 = new models.Adventure({
      campaign: campaign2.id,
      name: 'Avventura 4',
      description: 'Descrizione avventura 3',
      levelRange: '1 - 4',
    });
    await adventure4.save();

    const character1 = new models.Character({
      campaign: campaign1.id,
      name: "Personaggio 1",
      playerName: "Giocatore 1",
      background: "Background giocatore 1",
      publicBackground: "Background pubblico del giocatore 1",
      shareToken: {
        created: "2019-06-09T13:18:23.229Z",
        value: "WaFCrP4ok",
      }
    });
    await character1.save();

    const character2 = new models.Character({
      campaign: campaign1.id,
      name: "Personaggio 2",
      playerName: "Giocatore 2",
      background: "Background giocatore 2",
      publicBackground: "Background pubblico del giocatore 2",
    });
    await character2.save();

    const character3 = new models.Character({
      campaign: campaign1.id,
      name: "Personaggio 3",
      playerName: "Giocatore 3",
      background: "Background giocatore 3",
      publicBackground: "Background pubblico del giocatore 3",
    });
    await character3.save();

    const character4 = new models.Character({
      campaign: campaign2.id,
      name: "Personaggio 4",
      playerName: "Giocatore 4",
      background: "Background giocatore 4",
      publicBackground: "Background pubblico del giocatore 4",
    });
    await character4.save();

    const character5 = new models.Character({
      campaign: campaign2.id,
      name: "Personaggio 5",
      playerName: "Giocatore 5",
      background: "Background giocatore 5",
      publicBackground: "Background pubblico del giocatore 5",
    });
    await character5.save();

    const npc1 = new models.Npc({
      campaign: campaign1.id,
      name: 'Npc 1',
      description: 'Descrizione npc 1',
      info: 'Info npc 1',
      publicInfo: 'Info pubbliche dell\'npc 1',
    });
    await npc1.save();

    const npc2 = new models.Npc({
      campaign: campaign1.id,
      name: 'Npc 2',
      description: 'Descrizione npc 2',
      info: 'Info npc 2',
      publicInfo: 'Info pubbliche dell\'npc 2',
    });
    await npc2.save();

    const npc3 = new models.Npc({
      campaign: campaign1.id,
      name: 'Npc 3',
      description: 'Descrizione npc 3',
      info: 'Info npc 3',
      publicInfo: 'Info pubbliche dell\'npc 3',
    });
    await npc3.save();
  }
}


module.exports = {
  connectDb: connectDb,
  models: models,
  initializeDb: initializeDb
}