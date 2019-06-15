const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const User = require('../modules/users/model');
const Campaign = require('../modules/campaigns/model');
const Adventure = require('../modules/adventures/model');
const Character = require('../modules/characters/model');
const Npc = require('../modules/npcs/model');
const { TreasureChallenge, TreasureValuable, TreasureMagicItem, TreasureCommon, Treasure } = require('../modules/treasures/model');

const models = {
  User,
  Campaign,
  Adventure,
  Character,
  Npc,
  TreasureChallenge,
  TreasureValuable,
  TreasureMagicItem,
  TreasureCommon,
  Treasure,
};

const connectDb = () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(process.env.DATABASE_URL);
};

const _resetDatabase = true;
const _resetTreasure = true;

const initializeDb = async () => {
  if (_resetDatabase) {
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

    const treasure1 = new models.Treasure({
      campaign: campaign1.id,
      description: 'Descrizione tesoro 1',
      items: [
        'Oggetto 1 del tesoro',
        'Oggetto 2 del tesoro',
        'Oggetto 3 del tesoro',
        'Oggetto 4 del tesoro',
        'Oggetto 5 del tesoro'
      ]
    });
    await treasure1.save();

    const treasure2 = new models.Treasure({
      campaign: campaign1.id,
      description: 'Descrizione tesoro 2',
      items: [
        'Oggetto 1 del tesoro',
        'Oggetto 2 del tesoro',
        'Oggetto 3 del tesoro',
      ]
    });
    await treasure2.save();

    const treasure3 = new models.Treasure({
      campaign: campaign1.id,
      description: 'Descrizione tesoro 3',
      items: [
        'Oggetto 1 del tesoro',
        'Oggetto 2 del tesoro',
        'Oggetto 3 del tesoro',
        'Oggetto 4 del tesoro',
      ]
    });
    await treasure3.save();
  }
  if (_resetTreasure)
    await _initTreasure("./modules/treasures/json");
}

const _initTreasure = async (folder) => {
  var fileNames = await promisify(fs.readdir)(folder);
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const tableName = "Treasure" + fileName.replace(".json", "");
    await models[tableName].deleteMany({});
    var filePath = path.join(folder, fileName);
    var content = await promisify(fs.readFile)(filePath);
    var items = JSON.parse(content);
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      var dbItem = new models[tableName](item);
      await dbItem.save();
    }
  }
}

module.exports = {
  connectDb: connectDb,
  models: models,
  initializeDb: initializeDb
}